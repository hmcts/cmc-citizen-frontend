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
  defenceWithAmountClaimedAlreadyPaidData,
  defenceWithDisputeData
} from 'test/data/entity/responseData'

import {
  respondedAt,
  claimantRejectAlreadyPaid,
  directionsQuestionnaireDeadline,
  settlementOffer,
  settlementOfferAccept,
  settlementOfferReject,
  settledWithAgreement,
  intentionToProceedDeadline
} from 'test/data/entity/fullDefenceData'
import { FeatureToggles } from 'utils/featureToggles'
import { MediationOutcome } from 'claims/models/mediationOutcome'

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
      fullDefenceClaim.claim.defendants[0].name + ` says they paid you ${NumberFormatter.formatMoney(defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount)} on `,
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
    status: 'Full defence - defendant paid what he believe - claimant does not proceed in time',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...intentionToProceedDeadline
    },
    claimantAssertions: [
      'The court ended the claim',
      'This is because you didn’t proceed before the deadline of 4pm on',
      'You can contact us to apply for the claim to be restarted.',
      'Download the defendant’s full response'
    ],
    defendantAssertions: [
      'The court ended the claim',
      'This is because John Smith didn’t proceed with it before the deadline of 4pm on',
      'If they want to restart the claim, they need to ask for permission from the court. We’ll contact you by post if they do this.'
    ]
  },
  {
    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response without mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      response: { ...defenceWithAmountClaimedAlreadyPaidData },
      ...claimantRejectAlreadyPaid,
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'Wait for the court to review the case',
      `You’ve rejected ${fullDefenceClaim.claim.defendants[0].name}’s response and said you want to take the case to court.`,
      'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.',
      'Download their response'
    ],
    defendantAssertions: [
      `John Smith has rejected your admission of ${NumberFormatter.formatMoney(defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount)}`,
      'They said you didn’t pay them £' + defenceWithAmountClaimedAlreadyPaidData.paymentDeclaration.paidAmount,
      'You might have to go to a court hearing. We’ll contact you if we set a hearing date to tell you how to prepare.',
      'Download your response'
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

const legacyClaimDetails = [
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
      'You need to email CONTACT_EMAIL before 4pm on',
      'If you don’t send an email before the deadline, the claim will proceed without mediation.',
      'Download their response',
      'Tell us you’ve ended the claim',
      'If you’ve been paid or you’ve made another agreement with the defendant, you need to tell us.',
      'Tell us you’ve settled'
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
      'You need to email CONTACT_EMAIL before 4pm on',
      'If you don’t send an email before the deadline, the claim will proceed without mediation.',
      'Download their response',
      'Settle out of court',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.'
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
      'You need to email CONTACT_EMAIL before 4pm on',
      'If you don’t send an email before the deadline, the claim will proceed without mediation.',
      'Settle out of court',
      fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.',
      'View and respond to the offer',
      'If you’ve been paid',
      'Tell us you’ve settled'
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
    status: 'Full defence - defendant dispute all of the claim and accepts mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      },
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'The defendant’s response',
      'John Doe has rejected the claim. They’ve suggested mediation to help resolve this dispute.',
      'Find out how mediation works',
      'You need to email CONTACT_EMAIL before 4pm on',
      'If you don’t send an email before the deadline, the claim will proceed without mediation.'
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
      'They said they dispute your claim.',
      'complete a directions questionnaire',
      'Download their response',
      'Tell us you’ve ended the claim',
      'If you’ve been paid or you’ve made another agreement with the defendant, you need to tell us.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'You need to',
      'Your defence will be cancelled if you don’t complete and return the form before',
      'Settle out of court',
      'settle the claim out of court'
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
      'You need to',
      'Your claim won’t proceed if you don’t complete and return the form before',
      'Settle out of court',
      fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.',
      'View and respond to the offer',
      'Tell us you’ve ended the claim',
      'If you’ve been paid or you’ve made another agreement with the defendant, you need to tell us.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'You need to',
      'Your defence will be cancelled if you don’t complete and return the form before',
      'Settle out of court',
      'You made an offer to settle the claim out of court. ' + fullDefenceClaim.claim.claimants[0].name + ' can accept or reject your offer.'
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
      'You need to',
      'Your claim won’t proceed if you don’t complete and return the form before',
      'Settle out of court',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'You need to',
      'Your defence will be cancelled if you don’t complete and return the form before',
      'Settle out of court',
      'The claimant has accepted your offer and signed a legal agreement. You need to sign the agreement to settle out of court.',
      'Sign the settlement agreement'
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
      'You need to',
      'Your claim won’t proceed if you don’t complete and return the form before ',
      'Settle out of court',
      'You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.',
      'Tell us you’ve ended the claim',
      'If you’ve been paid or you’ve made another agreement with the defendant, you need to tell us.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'Your defence will be cancelled if you don’t complete and return the form before',
      'Settle out of court',
      'The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.'
    ]
  }
]

const mediationDQEnabledClaimDetails = [
  {
    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response with mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...defenceWithAmountClaimedAlreadyPaidData,
        freeMediation: 'yes'
      },
      claimantResponse: {
        freeMediation: 'yes',
        settleForAmount: 'no',
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'You’ve rejected the defendant’s response.',
      'We’ll contact you to try to arrange a mediation appointment',
      'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
      'Find out how mediation works'
    ],
    defendantAssertions: [
      'John Smith has rejected your defence.',
      'We’ll contact you to try to arrange a mediation appointment',
      'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
      'Find out how mediation works'
    ]
  },
  {
    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response with mediation - mediation failed',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...defenceWithAmountClaimedAlreadyPaidData,
        freeMediation: 'yes'
      },
      claimantResponse: {
        freeMediation: 'yes',
        settleForAmount: 'no',
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline,
      mediationOutcome: MediationOutcome.FAILED
    },
    claimantAssertions: [
      'Wait for the court to review the case',
      'You’ve rejected John Doe’s response and said you want to take the case to court.',
      'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.',
      'Download their response'
    ],
    defendantAssertions: [
      'John Smith has rejected your defence.',
      'We’ll contact you to try to arrange a mediation appointment',
      'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
      'Find out how mediation works'
    ]
  },
  {
    status: 'Full defence - defendant paid what he believe - claimant rejected defendant response with mediation - mediation success',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...defenceWithDisputeData,
        freeMediation: 'yes'
      },
      claimantResponse: {
        freeMediation: 'yes',
        settleForAmount: 'no',
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline,
      mediationOutcome: MediationOutcome.SUCCEEDED
    },
    claimantAssertions: [
      'You both agreed a settlement through mediation'
    ],
    defendantAssertions: [
      'You both agreed a settlement through mediation',
      'The claimant can’t request a County Court Judgment against you unless you break the terms',
      'Contact ' + fullDefenceClaim.claim.claimants[0].name,
      'if you need their payment details. Make sure you get receipts for any payments.'
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
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.',
      'Settle out of court',
      'You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.',
      'If you’ve been paid',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [
      'Wait for the claimant to respond',
      'You’ve rejected the claim.',
      'You said you don’t want to use mediation to solve it. You might have to go to a hearing.',
      'We’ll contact you when the claimant responds.',
      'Settle out of court',
      'The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and reject mediation - defendant offers settlement to settle out of court - claimant rejected offer',
    claim: fullDefenceClaim,
    claimOverride: {
      createdAt: '2019-08-25',
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
      'Your claim won’t proceed if you don’t complete and return the form before 4pm on',
      'Download their response',
      'Settle out of court',
      'You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.',
      'If you’ve been paid',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'Your defence will be cancelled if you don’t complete and return the form before 4pm on',
      'Settle out of court',
      'The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.'
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
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.',
      'Settle out of court',
      'You’ve agreed to the offer made by ' + fullDefenceClaim.claim.defendants[0].name + ' and signed an agreement to settle your claim.',
      'We’ve asked ' + fullDefenceClaim.claim.defendants[0].name + ' to sign the agreement.'
    ],
    defendantAssertions: [
      'Wait for the claimant to respond',
      'You’ve rejected the claim.',
      'You said you don’t want to use mediation to solve it. You might have to go to a hearing.',
      'We’ll contact you when the claimant responds.',
      'Settle out of court',
      'The claimant has accepted your offer and signed a legal agreement. You need to sign the agreement to settle out of court.',
      'Sign the settlement agreement'
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
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.',
      'Settle out of court',
      fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.',
      'If you’ve been paid',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [
      'Wait for the claimant to respond',
      'You’ve rejected the claim.',
      'You said you don’t want to use mediation to solve it. You might have to go to a hearing.',
      'We’ll contact you when the claimant responds.',
      'Settle out of court',
      'You made an offer to settle the claim out of court. ' + fullDefenceClaim.claim.claimants[0].name + ' can accept or reject your offer.'
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
      'Decide whether to proceed',
      'John Doe has rejected your claim.',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.'
    ],
    defendantAssertions: [
      'Wait for the claimant to respond',
      'You’ve rejected the claim.',
      'You said you don’t want to use mediation to solve it. You might have to go to a hearing.',
      'We’ll contact you when the claimant responds.',
      'Settle out of court',
      'settle the claim out of court'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and rejects mediation - claimant does not do intention to proceed',
    claim: fullDefenceClaim,
    claimOverride: {
      response: {
        ...defenceWithDisputeData
      },
      ...directionsQuestionnaireDeadline,
      ...intentionToProceedDeadline
    },
    claimantAssertions: [
      'The court ended the claim',
      'This is because you didn’t proceed before the deadline of 4pm on',
      'You can contact us to apply for the claim to be restarted.',
      'Download the defendant’s full response'
    ],
    defendantAssertions: [
      'The court ended the claim',
      'This is because John Smith didn’t proceed with it before the deadline of 4pm on',
      'If they want to restart the claim, they need to ask for permission from the court. We’ll contact you by post if they do this.'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and rejects mediation with directions questionnaire enabled',
    claim: fullDefenceClaim,
    claimOverride: {
      ...directionsQuestionnaireDeadline,
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.NO
      }
    },
    claimantAssertions: [
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.',
      'View and respond'
    ],
    defendantAssertions: [
      'Wait for the claimant to respond',
      'You’ve rejected the claim.',
      'You said you don’t want to use mediation to solve it. You might have to go to a hearing.',
      'We’ll contact you when the claimant responds.',
      'Settle out of court',
      'settle the claim out of court'
    ]
  },
  {
    status: 'Full defence - defendant dispute all of the claim and accepts mediation',
    claim: fullDefenceClaim,
    claimOverride: {
      ...directionsQuestionnaireDeadline,
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      }
    },
    claimantAssertions: [
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.',
      'You need to decide whether to proceed with the claim',
      'If you’ve been paid',
      'Tell us you’ve ended the claim'
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
    status: 'Full defence - defendant dispute all of the claim and accepts mediation with directions questionnaire enabled',
    claim: fullDefenceClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...baseDefenceData,
        freeMediation: FreeMediationOption.YES
      }
    },
    claimantAssertions: [
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim.',
      'View and respond'
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
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.',
      'Settle out of court',
      fullDefenceClaim.claim.defendants[0].name + ' has made an offer to settle out of court.',
      'View and respond to the offer',
      'Tell us you’ve ended the claim',
      'If you’ve been paid or you’ve made another agreement with the defendant, you need to tell us.',
      'Tell us you’ve settled'
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
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.',
      'Settle out of court',
      'Tell us you’ve ended the claim',
      'If you’ve been paid or you’ve made another agreement with the defendant, you need to tell us.',
      'Tell us you’ve settled'
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
      'Decide whether to proceed',
      fullDefenceClaim.claim.defendants[0].name + ' has rejected your claim',
      'You need to decide whether to proceed with the claim. You need to respond before 4pm on',
      'Your claim won’t continue if you don’t respond by then.',
      'Settle out of court',
      'You’ve rejected the defendant’s offer to settle out of court. You won’t receive any more offers from the defendant.',
      'If you’ve been paid',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You have rejected the claim. You’ve suggested mediation.',
      'We’ll ask ' + fullDefenceClaim.claim.claimants[0].name + ' if they agree to take part in mediation.',
      'Download your response',
      'Settle out of court',
      'The claimant has rejected your offer to settle the claim. Complete the directions questionnaire.'
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
            claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-08-16'))
          })

          if (FeatureToggles.isEnabled('mediation')) {
            mediationDQEnabledClaimDetails.forEach(data => {
              it(`should render mediation or DQ status: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(claimPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          } else {
            legacyClaimDetails.forEach(data => {
              it(`should render legacy claim status: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(claimPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          }

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

          if (FeatureToggles.isEnabled('mediation')) {
            mediationDQEnabledClaimDetails.forEach(data => {
              it(`should render mediation or DQ dashboard: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(defendantPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
              })
            })
          } else {
            legacyClaimDetails.forEach(data => {
              it(`should render non mediation or DQ dashboard: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(defendantPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
              })
            })
          }
        })
      })
    })
  })
})
