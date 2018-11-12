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
const pagePath = Paths.paymentDatePage.evaluateUri({ externalId: externalId })

const heading: string = 'When do you want the defendant to pay?'

const draftOverride: object = {
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: PaymentType.BY_SET_DATE.value
      }
    }
  },
  courtDetermination: { disposableIncome: 100 }
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
          draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)
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
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when service is healthy', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)
          })

          context('when form is valid', async () => {
            beforeEach(() => {
              draftStoreServiceMock.resolveSave()
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
      })
    })
  })
})
