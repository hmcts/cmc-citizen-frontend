import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { FullAdmissionPaths, Paths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { ResponseType } from 'response/form/models/responseType'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = FullAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId })

const validFormData: object = {
  option: PaymentType.INSTALMENTS.value
}

describe('Defendant - when will you pay options', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve response draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        const fullAdmissionQuestion: string = 'When do you want to pay?'
        it(`should render page asking '${fullAdmissionQuestion}' when full admission was selected`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response:full-admission', {
            response: {
              type: ResponseType.FULL_ADMISSION
            }
          })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(fullAdmissionQuestion))
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotDefendantInCaseGuard(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

        context('when service is unhealthy', () => {
          it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot retrieve response draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectFind('Error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot save response draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response:full-admission')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.rejectUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when service is healthy', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response:full-admission', {
              response: {
                type: ResponseType.FULL_ADMISSION
              }
            })
            draftStoreServiceMock.resolveFind('mediation')
          })

          context('when form is valid', async () => {
            beforeEach(() => {
              draftStoreServiceMock.resolveUpdate()
            })

            async function checkThatSelectedPaymentOptionRedirectsToPage (data: object, expectedToRedirect: string) {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(data)
                .expect(res => expect(res).to.be.redirect.toLocation(expectedToRedirect))
            }

            it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: PaymentType.INSTALMENTS.value },
                Paths.taskListPage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to payment date page for "BY_SET_DATE" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: PaymentType.BY_SET_DATE.value },
                FullAdmissionPaths.paymentDatePage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to task list page for "IMMEDIATELY" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: PaymentType.IMMEDIATELY.value },
                Paths.taskListPage.evaluateUri({ externalId: externalId }))
            })
          })

          context('when form is invalid', async () => {
            it('should render page', async () => {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ name: 'John Smith' })
                .expect(res => expect(res).to.be.successful.withText('When do you want to pay?', 'div class="error-summary"'))
            })
          })
        })
      })
    })
  })
})
