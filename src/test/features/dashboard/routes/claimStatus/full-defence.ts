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
import { NumberFormatter } from 'utils/numberFormatter'

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
  },
  ...respondedAt
}

const testData = [
  {
    status: 'Full defence - defendant paid what he believe',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData }
    },
    claimantAssertions: [
      'The defendant’s response',
      fullDefenceClaim.claim.defendants[0].name + ' says they paid you £' + defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount + ' on ',
      'You can accept or reject this response.',
      'View and respond'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'We’ve emailed ' + fullDefenceClaim.claim.claimants[0].name + ' telling them when and how you said you paid the claim.',
      'Download your response'
    ]
  },
  {

    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...claimantRejectAlreadyPaid,
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'You’ve rejected the defendant’s admission',
      `They said they owe ${NumberFormatter.formatMoney(defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount)}`,
      'complete a directions questionnaire',
      'Download their response'
    ],
    defendantAssertions: [
      `${fullDefenceClaim.claim.claimants[0].name} rejected your admission of ${NumberFormatter.formatMoney(defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount)}`,
      'They said you didn’t pay them £' + defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount,
      'complete a directions questionnaire',
      'Download your response'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      }
    },
    claimantAssertions: [
      fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.',
      'Find out how mediation works',
      'If you don’t send an email before the deadline, the claim will proceed without mediation',
      'Download their response',
      'If you’ve been paid',
      'Tell us if you want to end the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You have rejected the claim. You’ve suggested mediation.',
      'We’ll ask ' + fullDefenceClaim.claim.claimants[0].name + ' if they agree to take part in mediation.',
      'Download your response',
      'Settle out of court',
      'settle the claim out of court'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'The defendant has rejected your claim',
      'They said they dispute your claim.',
      'complete a directions questionnaire',
      'Download their response',
      'If you’ve been paid',
      'Tell us if you want to end the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'complete a directions questionnaire',
      'Download your response',
      'Settle out of court',
      'settle the claim out of court'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOffer
    },
    claimantAssertions: [
      'The defendant’s response',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.',
      'Find out how mediation works',
      'If you don’t send an email before the deadline, the claim will proceed without mediation',
      'Download their response',
      'Settle out of court',
      fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.',
      'View and respond to the offer',
      'If you’ve been paid',
      'Tell us if you want to end the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You have rejected the claim. You’ve suggested mediation.',
      'We’ll ask ' + fullDefenceClaim.claim.claimants[0].name + ' if they agree to take part in mediation.',
      'Download your response',
      'Settle out of court',
      'You made an offer to settle the claim out of court. ' + fullDefenceClaim.claim.claimants[0].name + ' can accept or reject your offer.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOffer
    },
    claimantAssertions: [
      'The defendant has rejected your claim',
      'They said they dispute your claim.',
      'complete a directions questionnaire',
      'Download their response',
      'Settle out of court',
      fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.',
      'If you’ve been paid',
      'Tell us if you want to end the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it.',
      'complete a directions questionnaire',
      'Download your response',
      'Settle out of court',
      'You made an offer to settle the claim out of court. ' + fullDefenceClaim.claim.claimants[0].name + ' can accept or reject your offer.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant accepted offer',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferAccept
    },
    claimantAssertions: [
      'The defendant’s response',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.',
      'Find out how mediation works',
      'If you don’t send an email before the deadline, the claim will proceed without mediation',
      'Download their response',
      'Settle out of court',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.',
      'Request County Court Judgment',
      'request a County Court Judgment'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You have rejected the claim. You’ve suggested mediation.',
      'We’ll ask ' + fullDefenceClaim.claim.claimants[0].name + ' if they agree to take part in mediation.',
      'Download your response',
      'Settle out of court',
      'The claimant has accepted your offer and signed a legal agreement. You need to sign the agreement to settle out of court.',
      'Sign the settlement agreement'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant accepted offer',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferAccept
    },
    claimantAssertions: [
      'The defendant has rejected your claim',
      'They said they dispute your claim.',
      'complete a directions questionnaire',
      'Download their response',
      'Settle out of court',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.',
      'Request County Court Judgment',
      'request a County Court Judgment'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'complete a directions questionnaire',
      'Download your response',
      'Settle out of court',
      'The claimant has accepted your offer and signed a legal agreement. You need to sign the agreement to settle out of court.',
      'Sign the settlement agreement'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation - defendant offers settlement to settle out of court - claimant rejected offer',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferReject
    },
    claimantAssertions: [
      'The defendant’s response',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected the claim. They’ve suggested mediation to help resolve this dispute.',
      'Find out how mediation works',
      'If you don’t send an email before the deadline, the claim will proceed without mediation',
      'Download their response',
      'Settle out of court',
      'You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.',
      'If you’ve been paid',
      'Tell us if you want to end the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You have rejected the claim. You’ve suggested mediation.',
      'We’ll ask ' + fullDefenceClaim.claim.claimants[0].name + ' if they agree to take part in mediation.',
      'Download your response',
      'Settle out of court',
      'The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant rejected offer',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settlementOfferReject
    },
    claimantAssertions: [
      'The defendant has rejected your claim',
      'They said they dispute your claim.',
      'complete a directions questionnaire',
      'Download their response',
      'Settle out of court',
      'You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.',
      'If you’ve been paid',
      'Tell us if you want to end the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'complete a directions questionnaire',
      'Download your response',
      'Settle out of court',
      'The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim - defendant offers settlement to settle out of court - claim settled with agreement',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData
      },
      ...directionsQuestionnaireDeadline,
      ...settledWithAgreement
    },
    claimantAssertions: [
      'Agreement signed',
      'You’ve both signed a legal agreement. The claim is now settled.',
      'Download the settlement agreement'
    ],
    defendantAssertions: [
      'Agreement signed',
      'You’ve both signed a legal agreement. The claim is now settled.',
      'Download the settlement agreement'
    ]
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
