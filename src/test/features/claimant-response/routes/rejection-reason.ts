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
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = ClaimantResponsePaths.rejectionReasonPage.evaluateUri({ externalId: externalId })
const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId })
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj

const rejectionReason = {
  text: 'Reason for rejection is .....'
}

describe('Claimant Response - Rejection Reason', () => {
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
        draftStoreServiceMock.resolveFind('claimantResponse')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Why did you reject the repayment plan'))
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

      it('should return 500 when cannot retrieve claimantResponse draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(rejectionReason)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', () => {
        it('should redirect to task list page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse')
          draftStoreServiceMock.resolveUpdate()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(rejectionReason)
            .expect(res => expect(res).to.be.redirect.toLocation(taskListPagePath))
        })
      })

      context('when form is invalid', async () => {
        it('should render page with validation error', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind('claimantResponse')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ text: '' })
            .expect(res => expect(res).to.be.successful.withText('Enter why you rejected repayment plan'))
        })
      })
    })
  })
})
