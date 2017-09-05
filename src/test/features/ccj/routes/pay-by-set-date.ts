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
import { sampleClaimObj } from '../../../http-mocks/claim-store'
const externalId = sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const payBySetDatePage = Paths.payBySetDatePage.uri.replace(':externalId', externalId)
const repaymentPlanPage = Paths.repaymentPlanPage.uri.replace(':externalId', externalId)

describe('CCJ - Pay by set date', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', payBySetDatePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')

        await request(app)
          .get(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('When you want them to pay the amount'))
      })
    })
  })

  describe('on POST', () => {
    const validFormData = { known: 'true', date: { day: '31', month: '12', year: '2018' } }

    checkAuthorizationGuards(app, 'post', payBySetDatePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')

        await request(app)
          .post(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should return 500 and render error page when cannot save ccj draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.rejectSave('ccj', 'Error')

          await request(app)
            .post(payBySetDatePage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to repayment plan page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.resolveSave('ccj')

          await request(app)
            .post(payBySetDatePage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(repaymentPlanPage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')

          await request(app)
            .post(payBySetDatePage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: undefined })
            .expect(res => expect(res).to.be.successful.withText('When you want them to pay the amount', 'div class="error-summary"'))
        })
      })
    })
  })
})
