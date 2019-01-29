import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { app } from 'main/app'

const cookieName: string = config.get<string>('session.cookieName')
const draftType = 'claimantResponse'
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj

const pagePath = ClaimantResponsePaths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const settlementRequest = {
  partyStatements: [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'Daniel Murphy will pay the full amount, no later than 1 January 2019',
      completionDate: '2019-01-01T00:00:00.000'
    }
  }, {
    type: 'ACCEPTATION',
    madeBy: 'CLAIMANT'
  }]
}

describe('Claimant response: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when response submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind(draftType, { acceptPaymentMethod: undefined })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ClaimantResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should render page when everything is fine along with court decision', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
          draftStoreServiceMock.resolveFind(draftType)
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withText('Court decision'))
        })

        it('should render page when everything is fine but without court decision', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
          draftStoreServiceMock.resolveFind(draftType, { courtDetermination: undefined })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withoutText('Court decision'))
        })

        it('should redirect to incomplete submission when response is accepted but rest is incomplete', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind(draftType,
            {
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ClaimantResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should render page successfully when Defendant`s response is rejected', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind(draftType,
            {
              settleAdmitted: {
                admitted: {
                  option: 'no'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant response not submitted', () => {

        it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot save claimant response', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
          draftStoreServiceMock.resolveFind(draftType)
          draftStoreServiceMock.resolveFind('mediation')
          claimStoreServiceMock.rejectSaveClaimantResponse('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when form is valid and cannot delete draft response', async () => {
          draftStoreServiceMock.resolveFind(draftType)
          draftStoreServiceMock.resolveFind('mediation')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
          claimStoreServiceMock.resolveClaimantResponse()
          draftStoreServiceMock.rejectDelete()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(settlementRequest)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      it('should redirect to confirmation page when saved claimant response', async () => {
        draftStoreServiceMock.resolveFind(draftType)
        draftStoreServiceMock.resolveFind('mediation')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
        draftStoreServiceMock.resolveDelete()
        claimStoreServiceMock.resolveClaimantResponse()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(settlementRequest)
          .expect(res => expect(res).to.be.redirect
            .toLocation(ClaimantResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
  })
})
