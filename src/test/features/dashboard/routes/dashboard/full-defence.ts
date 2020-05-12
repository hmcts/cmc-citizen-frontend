import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'
import { MomentFactory } from 'shared/momentFactory'
import { FreeMediationOption } from 'forms/models/freeMediation'

import {
  baseDefenceData,
  baseResponseData,
  defenceWithAmountClaimedAlreadyPaidData,
  defenceWithDisputeData
} from 'test/data/entity/responseData'

import {
  claimantRejectAlreadyPaid,
  directionsQuestionnaireDeadline,
  intentionToProceedDeadline,
  respondedAt,
  settledWithAgreement,
  settlementOffer,
  settlementOfferAccept,
  settlementOfferReject
} from 'test/data/entity/fullDefenceData'
import { DefenceType } from 'claims/models/response/defenceType'
import { MediationOutcome } from 'claims/models/mediationOutcome'
import { YesNoOption } from 'models/yesNoOption'

const cookieName: string = config.get<string>('session.cookieName')

function fullDefenceClaim () {
  return {
    ...claimStoreServiceMock.sampleClaimObj,
    responseDeadline: MomentFactory.currentDate().add(1, 'days'),
    response: {
      ...baseResponseData,
      ...baseDefenceData,
      amount: 30
    },
    ...respondedAt()
  }
}

function testData () {
  return [
    {
      status: 'Full defence - defendant paid what he believe',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: { ...defenceWithAmountClaimedAlreadyPaidData }
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' believes that they’ve paid the claim in full.'],
      defendantAssertions: ['We’ve emailed ' + fullDefenceClaim().claim.claimants[0].name + ' telling them when and how you said you paid the claim.']
    },
    {
      status: 'Full defence - defendant paid what he believe - claimant does not proceed in time',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: { ...defenceWithAmountClaimedAlreadyPaidData },
        ...intentionToProceedDeadline()
      },
      claimantAssertions: ['This claim has ended'],
      defendantAssertions: ['This claim has ended']
    },
    {
      status: 'Full defence - defendant paid what he believe - claimant rejected defendant response',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: { ...defenceWithAmountClaimedAlreadyPaidData },
        ...claimantRejectAlreadyPaid(),
        ...directionsQuestionnaireDeadline()
      },
      claimantAssertions: ['You’ve rejected the defendant’s admission.'],
      defendantAssertions: [fullDefenceClaim().claim.claimants[0].name + ' rejected your admission of £100']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and accepts mediation',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES
        }
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
      defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
    },
    {
      status: 'Full defence - defendant sent paper response',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES
        },
        paperResponse: YesNoOption.YES.option
      },
      claimantAssertions: ['The claim will continue by post'],
      defendantAssertions: ['The claim will continue by post']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and reject mediation',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData
        },
        ...directionsQuestionnaireDeadline()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
      defendantAssertions: ['You’ve rejected the claim.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and rejects mediation - claimant does not do intention to proceed',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...defenceWithDisputeData
        },
        ...directionsQuestionnaireDeadline(),
        ...intentionToProceedDeadline()
      },
      claimantAssertions: ['This claim has ended'],
      defendantAssertions: ['This claim has ended']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES
        },
        ...directionsQuestionnaireDeadline(),
        ...settlementOffer()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
      defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData
        },
        ...directionsQuestionnaireDeadline(),
        ...settlementOffer()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
      defendantAssertions: ['You’ve rejected the claim.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant accepted offer',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES
        },
        ...directionsQuestionnaireDeadline(),
        ...settlementOfferAccept()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
      defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant accepted offer',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData
        },
        ...directionsQuestionnaireDeadline(),
        ...settlementOfferAccept()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
      defendantAssertions: ['You’ve rejected the claim.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant rejected offer',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES
        },
        ...directionsQuestionnaireDeadline(),
        ...settlementOfferReject()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
      defendantAssertions: ['You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant rejected offer',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData
        },
        ...directionsQuestionnaireDeadline(),
        ...settlementOfferReject()
      },
      claimantAssertions: [fullDefenceClaim().claim.defendants[0].name + ' has rejected your claim.'],
      defendantAssertions: ['You’ve rejected the claim.']
    },
    {
      status: 'Full defence - defendant dispute all of the claim - defendant offers settlement to settle out of court - claim settled with agreement',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData
        },
        ...directionsQuestionnaireDeadline(),
        ...settledWithAgreement()
      },
      claimantAssertions: ['You’ve both signed a legal agreement. The claim is now settled.'],
      defendantAssertions: ['You’ve both signed a legal agreement. The claim is now settled.']
    },
    {
      status: 'Full defence - defendant disputes the claim - claimant rejected defendant response with mediation - no online DQ',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES,
          defenceType: DefenceType.DISPUTE
        },
        claimantResponse: {
          freeMediation: 'yes',
          settleForAmount: 'no',
          type: 'REJECTION'
        },
        claimantRespondedAt: MomentFactory.currentDate(),
        ...directionsQuestionnaireDeadline()
      },
      claimantAssertions: ['We will contact you to try to arrange a mediation appointment'],
      defendantAssertions: ['We will contact you to try to arrange a mediation appointment']
    },
    {
      status: 'Full defence - defendant disputes the claim - claimant rejected defendant response with mediation - mediation failed',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES,
          defenceType: DefenceType.DISPUTE
        },
        claimantResponse: {
          freeMediation: 'yes',
          settleForAmount: 'no',
          type: 'REJECTION'
        },
        claimantRespondedAt: MomentFactory.currentDate(),
        ...directionsQuestionnaireDeadline(),
        mediationOutcome: MediationOutcome.FAILED
      },
      claimantAssertions: ['Mediation was unsuccessful'],
      defendantAssertions: ['Mediation was unsuccessful']
    },
    {
      status: 'Full defence - defendant disputes the claim - claimant rejected defendant response with mediation - mediation success',
      claim: fullDefenceClaim(),
      claimOverride: {
        response: {
          ...baseResponseData,
          ...baseDefenceData,
          freeMediation: FreeMediationOption.YES,
          defenceType: DefenceType.DISPUTE
        },
        claimantResponse: {
          freeMediation: 'yes',
          settleForAmount: 'no',
          type: 'REJECTION'
        },
        claimantRespondedAt: MomentFactory.currentDate(),
        ...directionsQuestionnaireDeadline(),
        mediationOutcome: MediationOutcome.SUCCEEDED
      },
      claimantAssertions: ['You both agreed a settlement through mediation'],
      defendantAssertions: ['You both agreed a settlement through mediation']
    }
  ]
}

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('Dashboard Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          })

          testData().forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              draftStoreServiceMock.resolveFindNoDraftFound()
              claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride)
              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          })

          testData().forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              draftStoreServiceMock.resolveFindNoDraftFound()
              claimStoreServiceMock.resolveRetrieveByDefendantId(data.claim.referenceNumber, '1', data.claim, data.claimOverride)
              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
