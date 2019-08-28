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
import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.paymentDatePage.evaluateUri({ externalId: externalId })

const heading: string = 'When do you want the defendant to pay?'

const claimantResponseDraftOverrideWithDisposableIncome: object = {
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: PaymentType.BY_SET_DATE.value
      }
    }
  },
  courtDetermination: { disposableIncome: 1000 }
}

const claimantResponseDraftOverrideWithNoDisposableIncome: object = {
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: PaymentType.BY_SET_DATE.value
      }
    }
  },
  courtDetermination: { disposableIncome: -100 }
}

describe('Claimant response: payment date', () => {
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
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
          draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome)
        })

        it(`should render page with heading '${heading}'`, async () => {
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(heading))
        })

        it('should show the claimant response notice', async () => {
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('The court will review your suggestion and may reject it if it’s sooner than the defendant can afford to repay the money.'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    const validFormData: object = {
      date: {
        year: 2050,
        month: 12,
        day: 31
      }
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
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot save draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
          draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome)
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        const dataToSend = {
          date: LocalDate.fromMoment(MomentFactory.currentDate().add(10, 'years'))
        }

        context('when form is valid', async () => {
          it('should redirect to repayment plan accepted page when court decision is CLAIMANT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveUpdate()
            draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend)
              .expect(res => expect(res).to.redirect.toLocation(
                Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered set date page when court decision is COURT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveUpdate()
            draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithNoDisposableIncome)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend)
              .expect(res => expect(res).to.redirect.toLocation(
                Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered instalments page when court decision is COURT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
            draftStoreServiceMock.resolveUpdate()
            draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithNoDisposableIncome)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend)
              .expect(res => expect(res).to.redirect.toLocation(
                Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to task list page when Defendant is business', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData)
            draftStoreServiceMock.resolveUpdate()
            draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithNoDisposableIncome)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend)
              .expect(res => expect(res).to.redirect.toLocation(
                Paths.taskListPage.evaluateUri({ externalId: externalId })))
          })
        })

        context('when form is invalid', async () => {
          it(`should render page with heading '${heading}'`, async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({})
              .expect(res => expect(res).to.be.successful.withText(heading, 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
