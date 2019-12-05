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
  basePartialAdmissionData, basePayByInstalmentsData, basePayBySetDateData, basePayImmediatelyData,
  baseResponseData
} from 'test/data/entity/responseData'

import {
  respondedAt,
  directionsQuestionnaireDeadline
} from 'test/data/entity/fullDefenceData'
import { MediationOutcome } from 'claims/models/mediationOutcome'
import {
  claimantAcceptRepaymentPlan,
  claimantAcceptRepaymentPlanByDetermination,
  claimantAcceptRepaymentPlanInInstalmentsByDetermination,
  claimantReferredToJudgeResponse,
  claimantReferredToJudgeResponseForInstalments,
  defendantRejectedSettlementOfferAcceptBySetDate,
  defendantRejectedSettlementOfferAcceptInInstalments,
  partialAdmissionAlreadyPaidData,
  settledWithAgreementBySetDate,
  settledWithAgreementBySetDatePastPaymentDeadline,
  settledWithAgreementInInstalments,
  settledWithAgreementInInstalmentsPastPaymentDeadline,
  settlementOfferAcceptBySetDate,
  settlementOfferAcceptInInstalment,
  settlementOfferByInstalments,
  settlementOfferBySetDate
} from 'test/data/entity/partAdmitData'

const cookieName: string = config.get<string>('session.cookieName')

const partAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...basePartialAdmissionData,
    amount: 30
  },
  ...respondedAt
}

const legacyClaimDetails = [
  {
    status: 'Partial admission - defendant responded pay immediately',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayImmediatelyData }
    },
    claimantAssertions: ['The defendant has admitted they owe £30',
      'They said they don’t owe the full amount you claimed.',
      'They’ve offered to pay the £30 immediately.',
      'They must make sure you have the money by',
      'Any cheques or transfers should be clear in your account.',
      'You can accept or reject their admission.',
      'View and respond',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['Your response to the claim',
      'You’ve said you owe £30 and offered to pay John Smith immediately.',
      'We’ll contact you when they respond.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay immediately - past payment deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayImmediatelyData },
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: ['The defendant has admitted they owe £30',
      'They said they don’t owe the full amount you claimed.',
      'They’ve offered to pay the £30 immediately.',
      'They must make sure you have the money by',
      'Any cheques or transfers should be clear in your account.',
      'You can accept or reject their admission.',
      'View and respond',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['Your response to the claim',
      'You’ve said you owe £30 and offered to pay John Smith immediately.',
      'We’ll contact you when they respond.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      ...settlementOfferBySetDate
    },
    claimantAssertions: ['The defendant has admitted they owe £30',
      'They’ve offered to pay by ',
      'You can accept or reject their admission.',
      'View and respond',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['Your response to the claim',
      'You’ve said you owe £30 and offered to pay John Smith by',
      'We’ll contact you when they respond.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant rejects repayment plan and referred to judge',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: { ...claimantReferredToJudgeResponse }
    },
    claimantAssertions: ['Awaiting judge’s review',
      'You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
      'A County Court Judgment has been issued against the defendant.',
      'We’ll post a copy of the judgment to you and to John Doe',
      'A judge will decide what John Doe can afford to pay, based on their financial details.',
      'We’ll contact you to tell you what to do next.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [partAdmissionClaim.claim.claimants[0].name + ' requested a County Court Judgment (CCJ) against you',
      'They accepted your offer to pay £30. They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith.',
      'A judge will make a repayment plan. We’ll contact you to tell you what to do next.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: {
        ...claimantAcceptRepaymentPlan
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: ['You’ve signed a settlement agreement',
      'We’ve emailed John Doe the repayment plan and the settlement agreement for them to sign.',
      'They must respond by',
      'We’ll email you when they respond.',
      'If they do not respond you can request a County Court Judgment.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [`John Smith asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by ',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: ['The defendant has not signed your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan shown in the agreement.',
      'The court will make an order requiring them to pay the money. It does not guarantee that they pay it.',
      'John Doe can still sign the settlement agreement until you request a CCJ.',
      'Request a County Court Judgment',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [`John Smith asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by ',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementBySetDate
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in full by ',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed agreement - past payment deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementBySetDatePastPaymentDeadline
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in full by',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...defendantRejectedSettlementOfferAcceptBySetDate
    },
    claimantAssertions: ['The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.',
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: ['You rejected the settlement agreement',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: ['You’ve signed a settlement agreement',
      'We’ve emailed John Doe the repayment plan and the settlement agreement for them to sign.',
      'They must respond by',
      'We’ll email you when they respond.',
      'If they do not respond you can request a County Court Judgment.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['John Smith rejected your repayment plan.',
      'John Smith accepted your offer to pay £30 but rejected your repayment plan.',
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'They asked you to sign a settlement agreement to formalise the plan.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by ',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: ['The defendant has not signed your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan shown in the agreement.',
      'The court will make an order requiring them to pay the money. It does not guarantee that they pay it.',
      'John Doe can still sign the settlement agreement until you request a CCJ.',
      'Request a County Court Judgment'
    ],
    defendantAssertions: ['John Smith asked you to sign a settlement agreement',
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by ',
      'hey can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settledWithAgreementBySetDate
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in full by',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed agreement - past payment deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settledWithAgreementBySetDatePastPaymentDeadline
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in full by',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...defendantRejectedSettlementOfferAcceptBySetDate
    },
    claimantAssertions: ['The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.',
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: ['You rejected the settlement agreement',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      ...settlementOfferByInstalments
    },
    claimantAssertions: ['The defendant has admitted they owe £30',
      'They’ve offered to pay in instalments.',
      'You can accept or reject their admission.',
      'View and respond',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['Your response to the claim',
      'You’ve said you owe £30 and offered to pay John Smith £100 every week starting',
      'We’ll contact you when they respond.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant rejects court repayment plan and referred to judge',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantResponse: { ...claimantReferredToJudgeResponseForInstalments }
    },
    claimantAssertions: ['Awaiting judge’s review',
      'You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.',
      'A County Court Judgment has been issued against the defendant.',
      'We’ll post a copy of the judgment to you and to John Doe',
      'A judge will decide what John Doe can afford to pay, based on their financial details.',
      'We’ll contact you to tell you what to do next.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['John Smith requested a County Court Judgment (CCJ) against you',
      'They accepted your offer to pay £30. They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      'When we’ve processed the request we’ll post a copy of the judgment to you and to John Smith.',
      'A judge will make a repayment plan. We’ll contact you to tell you what to do next.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: ['You’ve signed a settlement agreement',
      'We’ve emailed John Doe the repayment plan and the settlement agreement for them to sign.',
      'They must respond by',
      'We’ll email you when they respond.',
      'If they do not respond you can request a County Court Judgment.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['John Smith asked you to sign a settlement agreement',
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: ['The defendant has not signed your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan shown in the agreement.',
      'The court will make an order requiring them to pay the money. It does not guarantee that they pay it.',
      'John Doe can still sign the settlement agreement until you request a CCJ.',
      'Request a County Court Judgment',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['John Smith asked you to sign a settlement agreement',
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by ',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementInInstalments
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in instalments of £10 every month starting',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay £10 every month starting',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementInInstalmentsPastPaymentDeadline
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in instalments of £10 every month starting',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.',
      'Request County Court Judgment',
      'If the defendant doesn’t pay or breaks the terms of the settlement agreement, you can'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay £10 every month starting',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...defendantRejectedSettlementOfferAcceptInInstalments
    },
    claimantAssertions: ['The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.',
      'Request a County Court Judgment'
    ],
    defendantAssertions: ['You rejected the settlement agreement',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: ['You’ve signed a settlement agreement',
      'We’ve emailed John Doe the repayment plan and the settlement agreement for them to sign.',
      'They must respond by',
      'We’ll email you when they respond.',
      'If they do not respond you can request a County Court Judgment.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['John Smith rejected your repayment plan.',
      'John Smith accepted your offer to pay £30 but rejected your repayment plan.',
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'They asked you to sign a settlement agreement to formalise the plan.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: ['The defendant has not signed your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan shown in the agreement.',
      'The court will make an order requiring them to pay the money. It does not guarantee that they pay it.',
      'John Doe can still sign the settlement agreement until you request a CCJ.',
      'Request a County Court Judgment',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['John Smith asked you to sign a settlement agreement',
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'If you don’t sign or respond by',
      'they can request a County Court Judgment against you.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination  and offered a settlement agreement - defendant signed settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settledWithAgreementInInstalments
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in instalments of £10 every month starting',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement',
      'When you’ve been paid in full, you need to let us know.',
      'Tell us you’ve settled'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay £10 every month starting ',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settledWithAgreementInInstalmentsPastPaymentDeadline
    },
    claimantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says the defendant will pay you in instalments of £10 every month starting',
      'The agreement explains what you can do if the defendant breaks the terms.',
      'Download the settlement agreement'
    ],
    defendantAssertions: ['You’ve both signed a settlement agreement',
      'The agreement says you’ll repay £10 every month starting',
      'The claimant can’t request a County Court Judgment against you unless you break the terms.',
      'Download the settlement agreement',
      'you need their payment details. Make sure you get receipts for any payments.',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...defendantRejectedSettlementOfferAcceptInInstalments
    },
    claimantAssertions: ['The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them based on the repayment plan they offered.',
      'The court will order them to pay the money. It doesn’t guarantee that they’ll pay you.',
      'Request a County Court Judgment'
    ],
    defendantAssertions: ['You rejected the settlement agreement',
      'John Smith can request a County Court Judgment (CCJ) against you.',
      'A CCJ would order you to repay the money in line with the terms of the agreement.',
      'The court has reviewed the repayment plan and believes you can afford it.',
      'If John Smith requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.',
      'We’ll email you when John Smith responds',
      'Download your response'
    ]
  },
  {
    status: 'Partial admission - defendant states paid, less than claim amount accepted',
    claim: partAdmissionClaim,
    claimOverride: {
      response: { ...partialAdmissionAlreadyPaidData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days')
    },
    claimantAssertions: ['Respond to the defendant',
      'Respond to the defendant',
      'You can accept or reject this response.',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: ['Your response to the claim',
      'We’ve emailed John Smith telling them when and how you said you paid the claim.',
      'We’ll contact you to let you know how they respond. They can confirm you’ve paid and the claim is settled, or they can proceed with it.',
      'Download your response'
    ]
  },
  {
    status: 'Part admission - defendant part admits and rejects mediation DQs not enabled - claimant rejects part admission',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.NO
      },
      claimantResponse: {
        settleForAmount: 'no',
        type: 'REJECTION',
        freeMediation: FreeMediationOption.NO
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['Wait for the court to review the case',
      'You’ve rejected ' + partAdmissionClaim.claim.defendants[0].name + '’s response and said you want to take the case to court.'
    ],
    defendantAssertions: ['John Smith has rejected your admission of',
      'They believe you owe them the full £200 claimed.',
      'You might have to go to a hearing. We’ll contact you if we set a hearing date to tell you how to prepare.',
      'You need to',
      'to tell us more about the claim.',
      'Your defence won’t proceed if you don’t complete and return the form before',
      'Download your response'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs not enabled - claimant rejects part admission with mediation',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.YES
      },
      claimantResponse: {
        settleForAmount: 'no',
        freeMediation: FreeMediationOption.YES,
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'We’ll contact you to try to arrange a mediation appointment',
      'You’ve rejected the defendant’s response.',
      'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
      'Find out how mediation works',
      'Tell us you’ve ended the claim'
    ],
    defendantAssertions: [
      'We’ll contact you to try to arrange a mediation appointment',
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your defence.',
      'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
      'Find out how mediation works'
    ]
  }
]

const mediationDQEnabledClaimDetails = [
  {
    status: 'Part admission - defendant part admits and rejects mediation DQs enabled - claimant rejects part admission',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.NO
      },
      claimantResponse: {
        settleForAmount: 'no',
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'Wait for the court to review the case',
      'You’ve rejected ' + partAdmissionClaim.claim.defendants[0].name + '’s response and said you want to take the case to court.',
      'The court will review the case. We’ll contact you to tell you what to do next.'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of',
      'They believe you owe them the full ',
      'You might have to go to a hearing. We’ll contact you if we set a hearing date to tell you how to prepare.'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.YES
      },
      claimantResponse: {
        settleForAmount: 'no',
        freeMediation: FreeMediationOption.YES,
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'We’ll contact you to try to arrange a mediation appointment',
      'You rejected the defendant’s admission of ',
      'You’ve both agreed to try mediation. We’ll contact you to arrange a call with the mediator.',
      'Find out how mediation works'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of',
      'They believe you owe them the full ',
      'They have agreed to try mediation. We’ll contact you to try to arrange an appointment.'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation - mediation failed',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.YES,
        directionsQuestionnaire: {
          hearingLoop: 'NO',
          selfWitness: 'NO',
          disabledAccess: 'NO',
          hearingLocation: 'Central London County Court',
          hearingLocationOption: 'SUGGESTED_COURT'
        }
      },
      claimantResponse: {
        settleForAmount: 'no',
        freeMediation: FreeMediationOption.YES,
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline,
      mediationOutcome: MediationOutcome.FAILED
    },
    claimantAssertions: [
      'Mediation was unsuccessful',
      'You weren’t able to resolve your claim against ' + partAdmissionClaim.claim.defendants[0].name + ' using mediation.',
      'You’ll have to go to a hearing. We’ll contact you with the details.'
    ],
    defendantAssertions: [
      'Mediation was unsuccessful',
      'You weren’t able to resolve ' + partAdmissionClaim.claim.claimants[0].name + '’s claim against you using mediation.',
      'You’ll have to go to a hearing. We’ll contact you with the details.',
      'Download ' + partAdmissionClaim.claim.claimants[0].name + '’s hearing requirements'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation - mediation success',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.YES
      },
      claimantResponse: {
        settleForAmount: 'no',
        freeMediation: FreeMediationOption.YES,
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline,
      mediationOutcome: MediationOutcome.SUCCEEDED
    },
    claimantAssertions: [
      'You settled the claim through mediation',
      'You signed an agreement which means the claim is now ended and sets out the terms of how ' + partAdmissionClaim.claim.defendants[0].name + ' must repay you.',
      'Download the agreement',
      '(PDF)'
    ],
    defendantAssertions: [
      'You settled the claim through mediation',
      'You signed an agreement which means the claim is now ended and sets out the terms of how you must repay ' + partAdmissionClaim.claim.claimants[0].name + '.',
      'Download the agreement',
      '(PDF)',
      'Contact ' + partAdmissionClaim.claim.claimants[0].name,
      'if you need their payment details. Make sure you get receipts for any payments.'
    ]
  }
]

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: partAdmissionClaim.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: partAdmissionClaim.externalId })

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

          mediationDQEnabledClaimDetails.forEach(data => {
            it(`should render mediation or DQ status: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

              await request(app)
                .get(claimPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })

          legacyClaimDetails.forEach(data => {
            it(`should render legacy claim status: ${data.status}`, async () => {
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

          mediationDQEnabledClaimDetails.forEach(data => {
            it(`should render mediation or DQ dashboard: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

              await request(app)
                .get(defendantPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })

          legacyClaimDetails.forEach(data => {
            it(`should render non mediation or DQ dashboard: ${data.status}`, async () => {
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
