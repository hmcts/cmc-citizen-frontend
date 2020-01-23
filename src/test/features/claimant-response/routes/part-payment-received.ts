import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as responseData from 'test/data/entity/responseData'
import { Paths } from 'claimant-response/paths'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkNotClaimantInCaseGuard } from './checks/not-claimant-in-case-check'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { FreeMediationOption } from 'forms/models/freeMediation'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.partPaymentReceivedPage.evaluateUri({ externalId: externalId })

const equalToClaimAmountDefendantResponseClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  totalAmountTillDateOfIssue: responseData.partialAdmissionAlreadyPaidData.amount,
  response: responseData.partialAdmissionAlreadyPaidData
}

const lessThanClaimAmountDefendantResponseClaim = {
  ...equalToClaimAmountDefendantResponseClaim,
  totalAmountTillDateOfIssue: equalToClaimAmountDefendantResponseClaim.response.amount + 10
}

function checkPaymentLessThanClaimAmountGuard (app: any, method: string, pagePath: string) {

  it(`for ${method} should be not found payment is equal to claim amount`, async () => {
    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
    claimStoreServiceMock.resolveRetrieveClaimByExternalId(equalToClaimAmountDefendantResponseClaim)

    draftStoreServiceMock.resolveFind('claimantResponse', {})

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=ABC`)
      .expect(res => expect(res).to.be.notFound)

  })
}

describe('Claimant Response: part payment received page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)
    checkPaymentLessThanClaimAmountGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim)
          draftStoreServiceMock.resolveFind('claimantResponse', {
            freeMediation: {
              option: FreeMediationOption.NO
            }
          })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Has the defendant paid you'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)
    checkPaymentLessThanClaimAmountGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when form is invalid', () => {
        it('should render page with error summary when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('claimantResponse', {})
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Has the defendant paid you', 'div class="error-summary"'))
        })
      })

      context('when form is valid', () => {
        beforeEach(() => {
          draftStoreServiceMock.resolveFind('claimantResponse', {})
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim)
          draftStoreServiceMock.resolveUpdate()
        })

        it('should redirect to the task list page when yes is selected', async () => {
          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ received: 'yes' })
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.taskListPage.evaluateUri({ externalId: externalId })))

        })

        it('should redirect to the task list page when no is selected', async () => {
          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ received: 'no' })
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.taskListPage.evaluateUri({ externalId: externalId })))
        })
      })
    })
  })
})
