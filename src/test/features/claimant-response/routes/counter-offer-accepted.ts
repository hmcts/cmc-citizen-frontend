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
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimantResponsePaths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId })
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj

describe('Claimant Response - Counter offer accepted', () => {
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

      it('should render page when both defendant and claimants payment frequency are same', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
        draftStoreServiceMock.resolveFind('claimantResponse')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The court has accepted your repayment plan'))
      })

      it('should render page when both defendant and claimants payment frequency are different', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
        draftStoreServiceMock.resolveFind('claimantResponse', {
          alternatePaymentMethod: {
            paymentOption: {
              option: {
                value: 'INSTALMENTS',
                displayValue: 'By instalments'
              }
            },
            paymentPlan: {
              totalAmount: 3326.59,
              instalmentAmount: 10,
              firstPaymentDate: {
                year: 2019,
                month: 1,
                day: 1
              },
              paymentSchedule: {
                value: PaymentSchedule.EVERY_TWO_WEEKS,
                displayValue: 'Every 2 weeks'
              }
            }
          }
        })
        draftStoreServiceMock.resolveSave()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The court’s proposed repayment plan'))
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

      it('should redirect to task list page', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(taskListPagePath))
      })
    })
  })
})
