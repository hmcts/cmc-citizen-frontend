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
import { Moment } from 'moment'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.paymentPlanPage.evaluateUri({ externalId: externalId })

const heading: string = 'Suggest instalments for the defendant'

const draftOverride: object = {
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: PaymentType.INSTALMENTS.value
      }
    }
  },
  courtDetermination: { disposableIncome: 100 }
}

describe('Claimant response: payment plan', () => {
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
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {
        it(`should render page with heading '${heading}'`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
          draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(heading))
        })

        it(`Should render the page with heading ${heading} when given a claim with a business defendant`, async () => {
          const claimObject = {
            ...claimStoreServiceMock.sampleClaimObj,
            ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj,
            claim: {
              ...claimStoreServiceMock.sampleClaimObj.claim,
              defendants: [
                {
                  type: 'organisation',
                  name: 'John Doe',
                  address: {
                    line1: 'line1',
                    line2: 'line2',
                    city: 'city',
                    postcode: 'bb127nq'
                  }
                }
              ]
            }
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimObject)
          draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(heading))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    const validFormData: object = {
      totalAmount: 160,
      instalmentAmount: 30,
      firstPaymentDate: {
        day: 31,
        month: 12,
        year: 2050
      },
      paymentSchedule: 'EVERY_MONTH'
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
          draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when service is healthy', () => {

        function setFirstPaymentDate (firstPaymentDate: Moment): object {
          return {
            day: firstPaymentDate.date(),
            month: firstPaymentDate.month() + 1,
            year: firstPaymentDate.year()
          }
        }

        function dataToSend (firstPaymentDate: Moment): object {
          return {
            totalAmount: 100,
            instalmentAmount: 50,
            firstPaymentDate: {
              day: firstPaymentDate.date(),
              month: firstPaymentDate.month() + 1,
              year: firstPaymentDate.year()
            },
            paymentSchedule: 'EVERY_MONTH'
          }
        }

        context('when form is valid', async () => {
          beforeEach(() => {
            draftStoreServiceMock.resolveUpdate()
          })

          it('should redirect to counter offer accepted page when decision type is CLAIMANT', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to counter offer accepted page when decision type is CLAIMANT_IN_FAVOUR_OF_DEFENDANT', async () => {
            const firstPaymentDate: Moment = MomentFactory.currentDate().add(100, 'years')

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({
                totalAmount: 160,
                instalmentAmount: 1,
                firstPaymentDate: setFirstPaymentDate(firstPaymentDate),
                paymentSchedule: 'EVERY_MONTH'
              })
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered set date page when decision type is DEFENDANT', async () => {
            const firstPaymentDate: Moment = MomentFactory.currentDate().add(32, 'days')

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithReasonablePaymentBySetDateResponseObjAndNoDisposableIncome)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend(firstPaymentDate))
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered instalments page when decision type is DEFENDANT', async () => {
            const firstPaymentDate: Moment = MomentFactory.currentDate().add(35, 'days')

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend(firstPaymentDate))
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to court offered instalments page when decision type is COURT', async () => {
            const firstPaymentDate: Moment = MomentFactory.currentDate().add(32, 'days')

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithUnReasonablePaymentSchedule)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend(firstPaymentDate))
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })))
          })

          it('should redirect to tasks list page when defendant is business', async () => {
            const firstPaymentDate: Moment = MomentFactory.currentDate().add(70, 'days')

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjCompanyData)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(dataToSend(firstPaymentDate))
              .expect(res => expect(res).to.be.redirect.toLocation(Paths.taskListPage.evaluateUri({ externalId: externalId })))
          })
        })

        context('when form is invalid', async () => {

          it(`should render page with heading '${heading}'`, async () => {
            const firstPaymentDate: Moment = MomentFactory.currentDate().add(32, 'days')

            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithUnReasonablePaymentSchedule)
            draftStoreServiceMock.resolveFind('claimantResponse', draftOverride)

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({
                totalAmount: 100,
                instalmentAmount: undefined,
                firstPaymentDate: setFirstPaymentDate(firstPaymentDate),
                paymentSchedule: 'EVERY_MONTH'
              })
              .expect(res => expect(res).to.be.successful.withText(heading, 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
