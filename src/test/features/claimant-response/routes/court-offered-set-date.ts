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
import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'
import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimantResponsePaths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId })

const validFormData = {
  accept: 'yes'
}

const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj
const defendantFullAdmissionResponse = claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj

describe('Claimant response: court offered set date page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
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

      it('should return 500 and render error page when cannot retrieve claimantResponse draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse', {
          courtDetermination: {
            decisionType: 'DEFENDANT',
            courtDecision: {
              paymentOption: 'BY_SPECIFIED_DATE',
              paymentDate: MomentFactory.parse('2018-11-01'),
              repaymentPlan: undefined }
          }
        })

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant can’t pay by your proposed date'))
      })

      it('should render page when everything is fine and COURT date is accepted', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse', {
          courtDetermination: {
            decisionType: 'COURT',
            courtDecision: {
              paymentOption: 'BY_SPECIFIED_DATE',
              paymentDate: MomentFactory.parse('2018-11-01'),
              repaymentPlan: undefined }
          }
        })

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant can’t pay by your proposed date'))
      })

      it('should render page when everything is fine and CLAIMANT date is accepted', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse)
        draftStoreServiceMock.resolveFind('claimantResponse', {
          courtDetermination: {
            decisionType: 'CLAIMANT',
            courtDecision: {
              paymentOption: 'BY_SPECIFIED_DATE',
              paymentDate: MomentFactory.parse('2018-11-01'),
              repaymentPlan: undefined }
          },
          alternatePaymentMethod: {
            paymentOption: {
              option: {
                value: 'BY_SPECIFIED_DATE',
                displayValue: 'By set date'
              }
            },
            paymentDate: new PaymentDate(new LocalDate(2018,11,1)),
            paymentPlan: undefined
          }
        })

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The defendant can’t pay by your proposed date'))
      })
    })

  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('when middleware failure', () => {
        it('should return 500 when cannot retrieve claim by external id', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 when cannot retrieve claimantResponse draft', async () => {
          draftStoreServiceMock.rejectFind('Error')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when form is valid', async () => {
        it('should redirect to task list page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(taskListPagePath))
        })

        it('should return 500 and render error page when cannot save claimantResponse draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse')
          draftStoreServiceMock.rejectUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when form is invalid', async () => {
        it('should render page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse',
            {
              courtDetermination: {
                decisionType: 'COURT',
                courtDecision: {
                  paymentOption: 'BY_SPECIFIED_DATE',
                  paymentDate: MomentFactory.parse('2018-11-01'),
                  repaymentPlan: undefined }
              }
            })

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ accept: undefined })
            .expect(res => expect(res).to.be.successful.withText('Please select yes or no'))
        })
      })
    })
  })
})
