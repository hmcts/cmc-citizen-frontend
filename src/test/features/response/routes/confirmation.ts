import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as fullDefenceMock from 'test/data/entity/fullDefenceData'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

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

      it('should render page when DQs enabled and user said no to mediation', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(fullDefenceMock.sampleClaimWithFullDefenceNoMediationDQsEnabled)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'accepts your response the claim will be settled. We’ll contact you by post when they respond.',
            'If they reject your response the court will review the case. You might have to go to a hearing.',
            'We’ll contact you by post if we set a hearing date to tell you how to prepare.',
            'Settle out of court',
            'For example you could offer to repair goods you sold the claimant or suggest a payment.',
            'You can avoid getting a County Court Judgment if the claimant accepts your offer.'
          ))
      })

      it('should render mediation option when mediation is yes', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(fullDefenceMock.sampleClaimWithFullDefenceMediation)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'if they want to try mediation. If they agree, we’ll contact you with a date for an appointment. If not, we’ll tell you what to do.',
            'Settle out of court',
            'For example you could offer to repair goods you sold the claimant or suggest a payment.',
            'You can avoid getting a County Court Judgment if the claimant accepts your offer.'
          ))
      })

      it('should render full defence paper DQ page when no mediation is chosen', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(fullDefenceMock.sampleClaimWithFullDefenceNoMediation)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'You’ll have to go to a hearing.',
            'complete a directions questionnaire form',
            'Your defence will be cancelled if you don’t complete and return the form by 4pm on',
            'We’ll contact you when we set a hearing date to tell you how to prepare.',
            'Settle out of court',
            'For example you could offer to repair goods you sold the claimant or suggest a payment.',
            'You can avoid getting a County Court Judgment if the claimant accepts your offer.'
          ))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response')

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })
    })
  })
})
