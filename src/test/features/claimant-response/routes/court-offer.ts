import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/response/routes/checks/authorization-check'
import { checkNotDefendantInCaseGuard } from 'test/features/response/routes/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimantResponsePaths.courtOfferPage.evaluateUri({ externalId: externalId })
const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId })
const defendantFullAdmissionResponse = claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj
const rejectionReasonPagePath = ClaimantResponsePaths.rejectionReasonPage.evaluateUri({ externalId: externalId })
const draftOverrideForClaimantReponse = {
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: 'INSTALMENTS',
        displayValue: 'By instalments'
      }
    },
    paymentPlan: {
      totalAmount: 3326.59,
      instalmentAmount: 3000,
      firstPaymentDate: {
        year: 2019,
        month: 1,
        day: 1
      },
      paymentSchedule: {
        value: 'EACH_WEEK',
        displayValue: 'Each week'
      }
    }
  }
}

describe('Claimant Response - Court offer', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page with courts proposed repayment plan', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Your instalments are more than the ' +
            'defendant can afford'))
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should redirect to task list page when court offer is accepted', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse', draftOverrideForClaimantReponse)
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ acceptCourtOffer: 'yes' })
          .expect(res => expect(res).to.be.redirect.toLocation(taskListPagePath))
      })

      it('should redirect to rejection reason page when court offer is rejected', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse', draftOverrideForClaimantReponse)
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ acceptCourtOffer: 'no' })
          .expect(res => expect(res).to.be.redirect.toLocation(rejectionReasonPagePath))
      })
    })
  })
})
