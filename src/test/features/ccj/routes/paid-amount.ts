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
import { PaidAmountOption } from 'ccj/form/models/paidAmount'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8'
const paidAmountPage = Paths.paidAmountPage.uri.replace(':externalId', externalId)
const paidAmountSummaryPage = Paths.paidAmountSummaryPage.uri.replace(':externalId', externalId)

const validFormData = {
  option: PaidAmountOption.YES,
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

        context('when form is valid', async () => {
          it('should redirect to claim amount page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')
            draftStoreServiceMock.resolveSave('ccj')

            await request(app)
              .post(paidAmountPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(paidAmountSummaryPage))
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
