import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
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
    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...respondedAt,
      ...claimantRejectAlreadyPaid,
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['000MC000', 'You’ve rejected the defendant’s admission'],
    defendantAssertions: ['000MC000', fullDefenceClaim.claim.claimants[0].name + ' rejected your admission of £100']
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      }
    },
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.'],
    defendantAssertions: ['000MC000', 'You have rejected the claim. You’ve suggested mediation.']
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      ...respondedAt,
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['000MC000', 'The defendant has rejected your claim'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.']
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court',
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
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.',fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.'],
    defendantAssertions: ['000MC000', 'You have rejected the claim. You’ve suggested mediation.','ou made an offer to settle the claim out of court. ' + fullDefenceClaim.claim.claimants[0].name + ' can accept or reject your offer.']
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court',
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
    claimantAssertions: ['000MC000', 'The defendant has rejected your claim', fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and said you don’t want to use mediation to solve it.','You made an offer to settle the claim out of court. ' + fullDefenceClaim.claim.claimants[0].name + ' can accept or reject your offer.']
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant accepted offer',
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
    claimantAssertions: [
      '000MC000',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.'
    ],
    defendantAssertions: [
      '000MC000',
      'You have rejected the claim. You’ve suggested mediation.',
      'The claimant has accepted your offer and signed a legal agreement. You need to sign the agreement to settle out of court.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant accepted offer',
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
    claimantAssertions: [
      '000MC000',
      'The defendant has rejected your claim',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.'
    ],
    defendantAssertions: [
      '000MC000',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'The claimant has accepted your offer and signed a legal agreement. You need to sign the agreement to settle out of court.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant rejected offer',
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
    claimantAssertions: ['000MC000', fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.','You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.'],
    defendantAssertions: ['000MC000', 'You have rejected the claim. You’ve suggested mediation.','The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.']
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant rejected offer',
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
    claimantAssertions: ['000MC000', 'The defendant has rejected your claim','You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.'],
    defendantAssertions: ['000MC000', 'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.','The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.']
  },
  {
    status: 'Full defence - defendant dispute all of the claim - defendant offers settlement to settle out of court - claim settled with agreement',
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

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: fullDefenceClaim.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: fullDefenceClaim.externalId })

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', claimPagePath)
    checkAuthorizationGuards(app, 'get', defendantPagePath)

    context('when user authorised', () => {
      context('Claim Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
          })

          testData.forEach(data => {
            it(`should render claim status: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)
              await request(app)
                .get(claimPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('123', 'citizen')
          })

          testData.forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)
              await request(app)
                .get(defendantPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
