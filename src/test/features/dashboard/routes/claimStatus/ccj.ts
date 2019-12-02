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
import {
  baseFullAdmissionData, basePayByInstalmentsData, basePayBySetDateData,
  basePayImmediatelyDatePastData,
  baseResponseData, partialAdmissionWithSoMPaymentBySetDateData
} from 'test/data/entity/responseData'
import { PaymentOption } from 'claims/models/paymentOption'
import {
  courtDeterminationChoseClaimantData,
  courtDeterminationChoseDefendantData,
  courtDeterminationChoseCourtData
} from 'test/data/entity/courtDeterminationData'
import {
  ccjAdmissionBySpecifiedDate,
  ccjDeterminationByInstalment,
  ccjDeterminationBySpecifiedDate
} from 'test/data/entity/ccjData'

const cookieName: string = config.get<string>('session.cookieName')

const fullAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...baseFullAdmissionData
  }
}

const testData = [
  {
    status: 'CCJ - claim submitted and defendant has not responded and is past deadline',
    claim: claimStoreServiceMock.sampleClaimObj,
    claimOverride: {
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: [
      'You can request a County Court Judgment',
      claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name + ' has not responded to your claim by the deadline. ' +
      'You can request a County Court Judgment (CCJ) against them.',
      claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name + ' can still respond to the claim until you request a CCJ.'
    ],
    defendantAssertions: [
      'You haven’t responded to this claim',
      'You haven’t responded to the claim. ' + claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name
      + ' can now ask for a County Court Judgment against you.',
      'A County Court Judgment can mean you find it difficult to get credit, like a mortgage or mobile ' +
      'phone contract. Bailiffs could also be sent to your home.',
      'You can still respond to the claim before they ask for a judgment.'
    ]
  },
  {
    status: 'CCJ - full admission, pay immediately, past deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyDatePastData }
    },
    claimantAssertions: ['000MC000',
      'The defendant said they’ll pay you immediately',
      'You need to tell us if you’ve settled the claim, for example because the defendant has paid you.',
      'You can settle for less than the full claim amount.',
      'If you haven’t been paid',
      'If the defendant has not paid you, you can'
    ],
    defendantAssertions: ['000MC000',
      'Your response to the claim',
      `You said you’ll pay ${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} £${claimStoreServiceMock.sampleClaimObj.claim.amount.rows[0].amount} before 4pm on ${MomentFactory.currentDate().subtract(5, 'days').format('D MMMM YYYY')}.`,
      'If you pay by cheque or transfer the money must be clear in their account.',
      'If they don’t receive the money by then, they can request a County Court Judgment against you.',
      ' if you need their payment details. Make sure you get receipts for any payments.']
  },
  {
    status: 'CCJ - full admission, pay immediately, past deadline - claimant requests CCJ',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: {
        ...fullAdmissionClaim.response, paymentIntention: {
          paymentOption: PaymentOption.IMMEDIATELY,
          paymentDate: MomentFactory.currentDate().subtract(5, 'days')
        }
      },
      countyCourtJudgment: {
        'ccjType': 'DEFAULT',
        'paidAmount': 10,
        'payBySetDate': '2022-01-01',
        'paymentOption': 'BY_SPECIFIED_DATE',
        'defendantDateOfBirth': '2000-01-01'
      },
      countyCourtJudgmentRequestedAt: MomentFactory.currentDate().subtract(1, 'days'),
      responseDeadline: MomentFactory.currentDate().subtract(16, 'days')
    },
    claimantAssertions: ['000MC000',
      'Wait for the judgment to be confirmed',
      'We’ll contact you within 10 working days to tell you whether the judgment has been entered.',
      'John Doe can no longer respond to your claim using this service - they may have responded by post.',
      'It’s possible we received a postal response before the deadline but hadn’t processed it when you requested judgment.',
      'If we discover this has happened, we’ll reject your request.'
    ],
    defendantAssertions: ['000MC000',
      'We’ll contact you',
      'John Smith has requested a County Court Judgment (CCJ) against you because the deadline for your response has passed.',
      'If you’ve responded by post before the deadline, we may still be processing your response. If we receive your postal response, we’ll reject the request for a CCJ.',
      'Otherwise we’ll post a copy of the CCJ to you and to John Smith and explain what to do next.'
    ]
  },
  {
    status: 'CCJ - full admission, pay by set date, claimant accepts the repayment plan and request a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
      countyCourtJudgment: { 'ccjType': 'ADMISSIONS', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your repayment plan.',
      'If a defendant doesn’t pay immediately, claimants can request a CCJ even if they accept a repayment plan.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15 to',
      'you need their payment details. Make sure you get receipts for any payments.'
    ]
  },
  {
    status: 'CCJ - part admission, pay by set date, claimant accepts the repayment plan and request a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { type: 'ACCEPTATION', formaliseOption: 'CCJ' },
      countyCourtJudgment: { ccjType: 'DETERMINATION', paidAmount: 10, payBySetDate: '2022-01-01', paymentOption: 'BY_SPECIFIED_DATE', defendantDateOfBirth: '2000-01-01' },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your repayment plan.',
      'If a defendant doesn’t pay immediately, claimants can request a CCJ even if they accept a repayment plan.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by set date, claimant accepts the repayment plan with settlement agreement, defendant rejects the settlement agreement',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithSetDateAndRejection,
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.',
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: ['000MC050',
      'You rejected the settlement agreement',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds'
    ]
  },
  {
    status: 'CCJ - part admission, pay by set date, claimant accepts the repayment plan with settlement agreement, defendant rejects the settlement agreement',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithSetDateAndRejection,
      claimantResponse: { type: 'ACCEPTATION', formaliseOption: 'SETTLEMENT' },
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.',
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: ['000MC050',
      'You rejected the settlement agreement',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds'
    ]
  },
  {
    status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and accepted alternative plan suggested by the court then requests a CCJ.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'CCJ',
        courtDetermination: {
          ...courtDeterminationChoseDefendantData
        }
      },
      countyCourtJudgment: { ...ccjDeterminationByInstalment },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They rejected your repayment plan.',
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15 to',
      'if you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - part admission, pay by set date, rejected the defendants repayment plan and accepted alternative plan suggested by the court then requests a CCJ.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'CCJ',
        courtDetermination: {
          ...courtDeterminationChoseDefendantData
        }
      },
      countyCourtJudgment: { ...ccjDeterminationByInstalment },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your offer to pay £3,000. They rejected your repayment plan.',
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15 to',
      'if you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and claimants suggested repayment plan accepted by the court then requests a CCJ.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'CCJ',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjDeterminationBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They rejected your repayment plan.',
      'They suggested a new repayment plan. The court believes you can afford the claimant’s plan, based on the financial details you provided.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      ' you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - part admission, pay by set date, rejected the defendants repayment plan and claimants suggested repayment plan accepted by the court then requests a CCJ.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'CCJ',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjDeterminationBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your offer to pay £3,000. They rejected your repayment plan.',
      'They suggested a new repayment plan. The court believes you can afford the claimant’s plan, based on the financial details you provided.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      ' you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by set date, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'Awaiting judge’s review',
      'You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
      'A County Court Judgment has been issued against the defendant.',
      'We’ll post a copy of the judgment to you and to John Doe',
      'A judge will decide what John Doe can afford to pay, based on their financial details.',
      'We’ll contact you to tell you what to do next.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith.',
      'A judge will make a repayment plan. We’ll contact you to tell you what to do next.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - part admission, pay by set date, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'Awaiting judge’s review',
      'You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
      'A County Court Judgment has been issued against the defendant.',
      'We’ll post a copy of the judgment to you and to John Doe',
      'A judge will decide what John Doe can afford to pay, based on their financial details.',
      'We’ll contact you to tell you what to do next.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your offer to pay £3,000. They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith.',
      'A judge will make a repayment plan. We’ll contact you to tell you what to do next.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'CCJ' },
      countyCourtJudgment: { 'ccjType': 'ADMISSIONS', 'paidAmount': 10, 'payBySetDate': '2022-01-01', 'paymentOption': 'BY_SPECIFIED_DATE', 'defendantDateOfBirth': '2000-01-01' },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your repayment plan.',
      'If a defendant doesn’t pay immediately, claimants can request a CCJ even if they accept a repayment plan.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15 to ',
      'if you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, rejected the defendants repayment plan and rejected alternative plan suggested by the court.',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'REFER_TO_JUDGE' },
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'Awaiting judge’s review',
      'You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
      'A County Court Judgment has been issued against the defendant.',
      'We’ll post a copy of the judgment to you and to John Doe',
      'A judge will decide what John Doe can afford to pay, based on their financial details.',
      'We’ll contact you to tell you what to do next.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith.',
      'A judge will make a repayment plan. We’ll contact you to tell you what to do next.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and offers a settlement agreement, defendant rejects the settlement agreement',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: { 'type': 'ACCEPTATION', 'formaliseOption': 'SETTLEMENT' },
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant accepts the repayment plan and offers a settlement agreement, defendant accepts the settlement agreement, claimant requests CCJ after set date',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      ...claimStoreServiceMock.settlementWithSetDateAndAcceptation,
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      claimantResponse: { type: 'ACCEPTATION', formaliseOption: 'SETTLEMENT' },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They requested the judgment because you didn’t pay on time or didn’t pay the correct amount.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, their offer is accepted by the court and offers a settlement agreement, defendant accepts the settlement agreement, claimant requests CCJ after set date',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      ...claimStoreServiceMock.settlementWithSetDateAndAcceptation,
      settlementReachedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'John Smith requested a County Court Judgment (CCJ) against you',
      'They requested the judgment because you didn’t pay on time or didn’t pay the correct amount.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, accepts the courts offer and offers a settlement agreement, defendant rejects the settlement agreement',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.'
    ],
    defendantAssertions: ['000MC050',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, accepts the courts offer and offers a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT',
        courtDetermination: {
          ...courtDeterminationChoseCourtData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'A County Court Judgment (CCJ) has been issued against you',
      'They rejected your repayment plan.',
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'They asked you to sign a settlement agreement. Because you didn’t sign it, they requested a CCJ against you.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - full admission, pay by repayment plan, claimant rejects the repayment plan, the court accepts their plan and they offer a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'A County Court Judgment (CCJ) has been issued against you',
      'They rejected your repayment plan.',
      'They suggested a new repayment plan. The court believes you can afford the claimant’s plan, based on the financial details you provided.',
      'They asked you to sign a settlement agreement. Because you didn’t sign it, they requested a CCJ against you.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - part admission, pay by repayment plan, claimant rejects the repayment plan, the courts accepts their plan and offers a settlement agreement, defendant rejects the settlement agreement and claimant requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT',
        courtDetermination: {
          ...courtDeterminationChoseClaimantData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'A County Court Judgment (CCJ) has been issued against you',
      'They accepted your offer to pay £3,000. They rejected your repayment plan.',
      'They suggested a new repayment plan. The court believes you can afford the claimant’s plan, based on the financial details you provided.',
      'They asked you to sign a settlement agreement. Because you didn’t sign it, they requested a CCJ against you.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - part admission, pay by repayment plan, claimant rejects the repayment plan, accepts the courts offer and offers a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT',
        courtDetermination: {
          ...courtDeterminationChoseCourtData
        },
        claimantPaymentIntention: {
          paymentDate: '2020-01-01',
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'A County Court Judgment (CCJ) has been issued against you',
      'They accepted your offer to pay £3,000. They rejected your repayment plan.',
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'They asked you to sign a settlement agreement. Because you didn’t sign it, they requested a CCJ against you.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'CCJ - part admission, pay by repayment plan, claimant accepts the repayment plan and they offer a settlement agreement, defendant rejects the settlement agreement. Claimant then requests a CCJ',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      settlement: claimStoreServiceMock.partySettlementWithInstalmentsAndRejection,
      claimantResponse: {
        type: 'ACCEPTATION',
        formaliseOption: 'SETTLEMENT'
      },
      countyCourtJudgment: { ...ccjAdmissionBySpecifiedDate },
      countyCourtJudgmentRequestedAt:  MomentFactory.currentDate().subtract(1, 'days'),
      response: { ...partialAdmissionWithSoMPaymentBySetDateData }
    },
    claimantAssertions: ['000MC050',
      'You requested a County Court Judgment against John Doe',
      'When we’ve processed your request, we’ll post a copy of the judgment to you and to John Doe',
      'View the repayment plan',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve been paid'
    ],
    defendantAssertions: ['000MC050',
      'A County Court Judgment (CCJ) has been issued against you',
      'They accepted your repayment plan.',
      'They asked you to sign a settlement agreement. Because you didn’t sign it, they requested a CCJ against you.',
      'View the repayment plan',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith.',
      'If you pay the debt within one month of the date of judgment, the CCJ is removed from the public register. You can pay £15',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  }
]

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

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
