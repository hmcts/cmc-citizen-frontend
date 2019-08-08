import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

const fullDefenceWithStatesPaidLessThanClaimAmount = claimStoreServiceMock.sampleFullDefenceWithStatesPaidLessThanClaimAmount
const fullDefenceWithStatesPaidLessThanClaimAmountWithMediation = claimStoreServiceMock.sampleFullDefenceWithStatesPaidLessThanClaimAmountWithMediation

describe('Defendant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'We’ll ask John Smith if they want to try mediation. If they agree, we’ll contact you with a date for an appointment. If not, we’ll tell you what to do.'))
      })

      it('should render page when yes for mediation and DQ', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse(claimStoreServiceMock.sampleDefendantResponseWithDQAndMediationObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'We’ll contact you when John Smith responds, to tell you what to do next.',
            'If John Smith accepts your response the claim will be ended.',
            'If they reject your response and agree to try mediation we’ll contact you to arrange a call with the mediator.',
            'If they reject your response and don’t want to try mediation, the court will review the case. You might have to go to a hearing.'))
      })

      it('should render page when no for mediation and DQ', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse(claimStoreServiceMock.sampleDefendantResponseWithDQAndNoMediationObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'We’ll contact you when John Smith responds, to tell you what to do next.',
            'If John Smith accepts your response the claim will be ended.',
            'If they reject your response the court will review the case. You might have to go to a hearing.'))
      })

      it('when full defence already paid with mediation should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleDefendantResponseAlreadyPaidWithMediationObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'If John Smith accepts your response the claim will be ended. We’ll contact you when they respond.',
            'If John Smith rejects your response we’ll ask them to try mediation. If they agree, we’ll contact you to arrange a call with the mediator.',
            'If they reject mediation the court will review the case. You might have to go to a hearing.',
            'We’ll contact you to tell you what to do next.'
          ))
      })

      it('when full defence already paid without mediation should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleDefendantResponseAlreadyPaidWithNoMediationObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'If John Smith accepts your response the claim will be ended. We’ll contact you when they respond.',
            'If they reject your response the court will review the case. You might have to go to a hearing.',
            'We’ll contact you if we set a hearing date to tell you how to prepare.'
          ))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response')

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render states paid with less than claim amount with next step - NO MEDIATION', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithStatesPaidLessThanClaimAmount)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('The court will review the case. You might have to go to a hearing.'))
      })

      it('should render states paid with less than claim amount with next step - WITH MEDIATION', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullDefenceWithStatesPaidLessThanClaimAmountWithMediation)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('We’ll ask if they want to try mediation. If they agree, we’ll contact you with an appointment.'))
      })
    })
  })
})
