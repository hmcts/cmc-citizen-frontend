import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'ccj/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = sampleClaimObj.externalId
const paidAmountPage = Paths.paidAmountPage.evaluateUri({ externalId: externalId })
const paidAmountSummaryPage = Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId })

const validFormData = {
  option: PaidAmountOption.YES.value,
  amount: 10
}

describe('CCJ - paid amount page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', paidAmountPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(paidAmountPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        draftStoreServiceMock.rejectRetrieve('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(paidAmountPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(paidAmountPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Has the defendant paid some of the amount owed?'))
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', paidAmountPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(paidAmountPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 when cannot retrieve CCJ draft', async () => {
            draftStoreServiceMock.rejectRetrieve('Error')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(paidAmountPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', async () => {
          it('should redirect to claim amount page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(paidAmountPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(paidAmountSummaryPage))
          })

          it('should return 500 and render error page when cannot save ccj draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(paidAmountPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is invalid', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')

            await request(app)
              .post(paidAmountPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: undefined })
              .expect(res => expect(res).to.be.successful.withText('Has the defendant paid some of the amount owed?', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
