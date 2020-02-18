import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'
import { attachDefaultHooks } from 'test/routes/hooks'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as settlementAgreementServiceMock from 'test/http-mocks/settlement-agreement'

import { Paths } from 'settlement-agreement/paths'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.signSettlementAgreement.evaluateUri({ externalId: externalId })

const claim = {
  ...claimStoreServiceMock.sampleClaimObj,
  settlement: {
    ...settlementAgreementServiceMock.sampleSettlementAgreementOffer
  },
  claimantResponse: {
    type: 'ACCEPTATION',
    formaliseOption: 'SETTLEMENT'
  }
}

describe('Settlement agreement: sign settlement agreement page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when settlement not countersigned', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Respond to the settlement agreement'))
        })

        verifyRedirectForGetWhenAlreadyPaidInFull(pagePath, claim)
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when response not submitted', () => {
        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Respond to the settlement agreement', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {

          it('should return 500 and render error page when cannot post to claim store', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            settlementAgreementServiceMock.rejectRejectSettlementAgreement()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'no' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when everything is fine and settlement agreement is rejected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            settlementAgreementServiceMock.resolveRejectSettlementAgreement()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'no' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.settlementAgreementConfirmation
                  .evaluateUri({ externalId: externalId })))
          })

          it('should redirect to confirmation page when everything is fine and settlement agreement is accepted', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim)
            settlementAgreementServiceMock.resolveCountersignSettlementAgreement()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: 'yes' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.settlementAgreementConfirmation
                  .evaluateUri({ externalId: externalId })))
          })

          verifyRedirectForPostWhenAlreadyPaidInFull(pagePath, claim, { option: 'yes' })
        })
      })
    })
  })
})
