import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { CCJPaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { checkNotClaimantInCaseGuard } from 'test/features/ccj/routes/checks/not-claimant-in-case-check'
import { sampleFullAdmissionWithPaymentBySetDateResponseObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = CCJPaths.paidAmountPage.evaluateUri({ externalId: externalId })
const paidAmountSummaryPage = CCJPaths.paidAmountSummaryPage.evaluateUri({ externalId: externalId })

const validFormData = {
  option: PaidAmountOption.YES.value,
  amount: 10,
  claimedAmount: 100
}

const heading: string = 'Has the defendant paid some of the amount owed?'

describe('Claimant Response - paid amount page', () => {
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

      it('should return 500 and render error page when cannot retrieve draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(heading))
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

          it('should return 500 when cannot retrieve draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.rejectFind('Error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', async () => {
          it('should redirect to claim amount summary page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse')
            draftStoreServiceMock.resolveUpdate()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(paidAmountSummaryPage))
          })

          it('should return 500 and render error page when cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
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
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({})
              .expect(res => expect(res).to.be.successful.withText(heading, 'div class="error-summary"'))
          })
        })

        context('when provided paid amount is greater than total amount', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(sampleFullAdmissionWithPaymentBySetDateResponseObj)
            draftStoreServiceMock.resolveFind('claimantResponse')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({
                option: PaidAmountOption.YES.value,
                amount: 101,
                claimedAmount: 100
              })
              .expect(res => expect(res).to.be.successful.withText(heading, 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
