import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'
import 'test/routes/expectations'

import { Paths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.alternateRepaymentPlanPage.evaluateUri({ externalId: externalId })

const heading: string = 'How do you want the defendant to pay?'

describe('Claimant response: payment options', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when service is unhealthy', () => {
        it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        it(`should render page with heading '${heading}'`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()
          draftStoreServiceMock.resolveFind('claimantResponse')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(heading))
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)
      checkNotClaimantInCaseGuard(app, method, pagePath)

      const validFormData: object = {
        option: PaymentType.INSTALMENTS.value
      }

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
        })

        context('when service is unhealthy', () => {
          it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot retrieve draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
            draftStoreServiceMock.rejectFind('Error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse')
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
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse')
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

            it('should redirect to court offer page for "IMMEDIATELY" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: PaymentType.IMMEDIATELY.value },
                Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to payment date page for "BY_SET_DATE" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: PaymentType.BY_SET_DATE.value },
                Paths.paymentDatePage.evaluateUri({ externalId: externalId }))
            })

            it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
              await checkThatSelectedPaymentOptionRedirectsToPage(
                { option: PaymentType.INSTALMENTS.value },
                Paths.paymentPlanPage.evaluateUri({ externalId: externalId }))
            })
          })

          context('when form is invalid', async () => {
            it(`should render page with heading '${heading}'`, async () => {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({})
                .expect(res => expect(res).to.be.successful.withText(heading, 'div class="error-summary"'))
            })
          })
        })

        context('When service is healthy - check all redirects are correct from payment option page', () => {
          const dataToSend = { option: PaymentType.IMMEDIATELY.value }

          it('should redirect to tasks list page when defendant is business', async () => {

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjCompanyData)
            draftStoreServiceMock.resolveFind('claimantResponse')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend)
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.taskListPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered instalments page when court decision is COURT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse', { courtDetermination: { disposableIncome: 100 } })
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: PaymentType.IMMEDIATELY.value })
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered set date page when court decision is DEFENDANT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithReasonablePaymentBySetDateResponseObjAndNoDisposableIncome)
            draftStoreServiceMock.resolveFind('claimantResponse', { courtDetermination: { disposableIncome: 100 } })
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: PaymentType.IMMEDIATELY.value })
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered instalments page when court decision is DEFENDANT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome)
            draftStoreServiceMock.resolveFind('claimantResponse', { courtDetermination: { disposableIncome: 100 } })
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: PaymentType.IMMEDIATELY.value })
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to pay by set date accepted page when court decision is CLAIMANT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateInNext2daysResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ option: PaymentType.IMMEDIATELY.value })
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })))
          })
        })
      })
    })
  })
})
