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
  defenceWithAmountClaimedAlreadyPaidData
} from 'test/data/entity/responseData'

import {
  respondedAt,
  claimantRejectAlreadyPaid,
  directionsQuestionnaireDeadline,
  settlementOffer,
  settlementOfferAccept,
  settlementOfferReject,
  settledWithAgreement
} from 'test/data/entity/fullDefenceData'

const cookieName: string = config.get<string>('session.cookieName')

const fullDefenceClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...baseDefenceData,
    amount: 30
  }
}

const testData = [
  {
    status: 'Full defence - defendant paid what he believe',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...respondedAt
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' believes that they’ve paid the claim in full.'],
    defendantAssertions: ['000MC000', 'We’ve emailed ' + fullDefenceClaim.claim.claimants[0].name + ' telling them when and how you said you paid the claim.']
  },
  {
    status: 'Full defence - defendant paid what he believe - claimant rejected to defendant response',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...respondedAt,
      ...claimantRejectAlreadyPaid,
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['000MC000', 'You’ve rejected the defendant’s admission.'],
    defendantAssertions: ['000MC000', fullDefenceClaim.claim.claimants[0].name + ' rejected your admission of £100']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and accept mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      }
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and reject mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim. You need to tell us more about the claim.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and accept mediation - defendant offers settlement to settle out of court',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOffer
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and reject mediation - defendant offers settlement to settle out of court',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOffer
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim. You need to tell us more about the claim.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and accept mediation - defendant offers settlement to settle out of court - claimant accepted offer',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferAccept
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and reject mediation - defendant offers settlement to settle out of court - claimant accepted offer',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferAccept
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim. You need to tell us more about the claim.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and accept mediation - defendant offers settlement to settle out of court - claimant rejected offer',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferReject
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested a mediation session to help resolve this dispute.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and suggested mediation. We’ll ask the claimant if they agree to take part in mediation.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim and reject mediation - defendant offers settlement to settle out of court - claimant rejected offer',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferReject
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim. You need to tell us more about the claim.']
  },
  {
    status: 'Full defence - defendant dispute all the of the claim - defendant offers settlement to settle out of court - claim settled with agreement',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settledWithAgreement
    },
    claimantAssertions: ['000MC000', 'You’ve both signed a legal agreement. The claim is now settled.'],
    defendantAssertions: ['000MC000', 'You’ve both signed a legal agreement. The claim is now settled.']
  }
]

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

          testData.forEach(data => {
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

          testData.forEach(data => {
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
