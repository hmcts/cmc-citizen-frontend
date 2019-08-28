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
const pagePath = Paths.settleClaimPage.evaluateUri({ externalId: externalId })

const equalToClaimAmountDefendantResponseClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  totalAmountTillDateOfIssue: responseData.partialAdmissionAlreadyPaidData.amount,
  response: responseData.partialAdmissionAlreadyPaidData
}

const lessThanClaimAmountDefendantResponseClaim = {
  ...equalToClaimAmountDefendantResponseClaim,
  totalAmountTillDateOfIssue: equalToClaimAmountDefendantResponseClaim.response.amount + 10
}

describe('Claimant Response: part payment received page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

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

        it('should render with "Do you agree" text if payment is equal to claim amount', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(equalToClaimAmountDefendantResponseClaim)
          draftStoreServiceMock.resolveFind('claimantResponse', {
            freeMediation: {
              option: FreeMediationOption.NO
            }
          })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Do you agree the defendant has paid'))
        })
        it('should render with "Do you want to settle" text if payment is less than claim amount', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim)
          draftStoreServiceMock.resolveFind('claimantResponse', {
            freeMediation: {
              option: FreeMediationOption.NO
            }
          })

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Do you want to settle the claim'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

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
            .expect(res => expect(res).to.be.successful.withText('Do you agree the defendant has paid', 'div class="error-summary"'))
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
            .send({ accepted: 'yes' })
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.taskListPage.evaluateUri({ externalId: externalId })))

        })

        it('should redirect to the reject reason page when no is selected', async () => {
          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ accepted: 'no' })
            .expect(res => expect(res).to.be.redirect
              .toLocation(Paths.rejectionReasonPage.evaluateUri({ externalId: externalId })))
        })
      })
    })
  })
})
