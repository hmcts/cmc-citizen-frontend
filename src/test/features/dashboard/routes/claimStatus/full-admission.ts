import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { NumberFormatter } from 'utils/numberFormatter'

import {
  baseFullAdmissionData,
  basePayByInstalmentsData,
  basePayBySetDateData,
  basePayImmediatelyData,
  baseResponseData
} from 'test/data/entity/responseData'

import {
  claimantResponseAt,
  claimantReferredToJudgeResponse,
  claimantReferredToJudgeResponseForInstalments,
  claimantAcceptRepaymentPlan,
  settlementOfferBySetDate,
  settlementOfferByInstalments,
  settlementOfferAcceptBySetDate,
  settlementOfferAcceptInInstalment,
  settledWithAgreementBySetDate,
  settledWithAgreementInInstalments,
  settledWithAgreementBySetDatePastPaymentDeadline,
  settledWithAgreementInInstalmentsPastPaymentDeadline,
  defendantRejectedSettlementOfferAcceptBySetDate,
  defendantRejectedSettlementOfferAcceptInInstalments,
  claimantAcceptRepaymentPlanByDetermination,
  claimantAcceptRepaymentPlanInInstalmentsByDetermination,
  setByDatePaymentIntentionPastDeadline,
  defendantOffersSettlementByInstalments,
  setByDatePaymentIntention

} from 'test/data/entity/fullAdmission'

const cookieName: string = config.get<string>('session.cookieName')

const fullAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(5, 'days'),
  response: {
    ...baseResponseData,
    ...baseFullAdmissionData
  },
  ...claimantResponseAt
}

const testData = [
  {
    status: 'Full admission - defendant responded pay immediately',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData }
    },
    claimantAssertions: [
      'The defendant said they’ll pay you immediately',
      'Tell us you’ve settled',
      'If you haven’t been paid',
      `If the defendant has not paid you by ${moment(fullAdmissionClaim.responseDeadline).format('LL')}, you can request a County Court Judgment.`
    ],
    defendantAssertions: [
      'Your response to the claim',
      `You said you’ll pay ${fullAdmissionClaim.claim.claimants[0].name} ${NumberFormatter.formatMoney(fullAdmissionClaim.claim.amount.rows[0].amount)} before 4pm on ${moment(fullAdmissionClaim.responseDeadline).format('LL')}.`,
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay immediately - past payment deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayImmediatelyData },
      responseDeadline: MomentFactory.currentDate().subtract(1, 'days')
    },
    claimantAssertions: [
      'You can request a County Court Judgment',
      `${fullAdmissionClaim.claim.defendants[0].name} has not responded to your claim by the deadline. You can request a County Court Judgment (CCJ) against them.`,
      `${fullAdmissionClaim.claim.defendants[0].name} can still respond to the claim until you request a CCJ.`,
      'Request a CCJ'
    ],
    defendantAssertions: [
      'You haven’t responded to the claim.',
      `You haven’t responded to the claim. ${fullAdmissionClaim.claim.claimants[0].name} can now ask for a County Court Judgment against you.`,
      'You can still respond to the claim before they ask for a judgment.',
      'Respond to claim'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      ...settlementOfferBySetDate
    },
    claimantAssertions: [
      `The defendant has offered to pay by ${moment(basePayBySetDateData.paymentIntention.paymentDate).format('LL')}.`,
      'View and respond to the offer',
      'If you’ve been paid',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'Your response to the claim',
      `You’ve offered to pay ${fullAdmissionClaim.claim.claimants[0].name} by ${moment(basePayBySetDateData.paymentIntention.paymentDate).format('LL')}.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant rejects repayment plan and referred to judge',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: { ...claimantReferredToJudgeResponse }
    },
    claimantAssertions: [
      'Awaiting judge’s review',
      `You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.`,
      'A County Court Judgment has been issued against the defendant.',
      `A judge will decide what ${fullAdmissionClaim.claim.defendants[0].name} can afford to pay, based on their financial details.`
    ],
    defendantAssertions: [
      fullAdmissionClaim.claim.claimants[0].name + ' requested a County Court Judgment (CCJ) against you',
      'They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      `When we’ve processed the request we’ll post a copy of the judgment to you and to ${fullAdmissionClaim.claim.claimants[0].name}.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: [
      'You’ve signed a settlement agreement',
      `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
      `They must respond by ${moment(MomentFactory.currentDate().add(7, 'days')).format('LL')}. We’ll email you when they respond.`,
      'If you’ve been paid',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: [
      'The defendant has not signed your settlement agreement',
      `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
      'Request a County Court Judgment',
      'If you’ve been paid',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementBySetDate
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in full by ${moment(setByDatePaymentIntention.paymentDate).format('LL')}.`,
      'Download the settlement agreement',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementBySetDatePastPaymentDeadline
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in full by ${moment(setByDatePaymentIntentionPastDeadline.paymentDate).format('LL')}.`,
      'Download the settlement agreement',
      'Tell us you’ve settled',
      'Request County Court Judgment',
      'request a County Court Judgment'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...defendantRejectedSettlementOfferAcceptBySetDate
    },
    claimantAssertions: [
      `The defendant has rejected your settlement agreement`,
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: [
      'You rejected the settlement agreement',
      `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
      `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: [
      'You’ve signed a settlement agreement',
      `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
      `They must respond by ${moment(MomentFactory.currentDate().add(7, 'days')).format('LL')}. We’ll email you when they respond.`
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} rejected your repayment plan.`,
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settlementOfferAcceptBySetDate
    },
    claimantAssertions: [
      'The defendant has not signed your settlement agreement',
      `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
      'Request a County Court Judgment'
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settledWithAgreementBySetDate
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in full by ${moment(setByDatePaymentIntention.paymentDate).format('LL')}.`,
      'Download the settlement agreement',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...settledWithAgreementBySetDatePastPaymentDeadline
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in full by ${moment(setByDatePaymentIntentionPastDeadline.paymentDate).format('LL')}.`,
      'Download the settlement agreement',
      'Tell us you’ve settled',
      'Request County Court Judgment',
      'request a County Court Judgment'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay by set date - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayBySetDateData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanByDetermination },
      ...defendantRejectedSettlementOfferAcceptBySetDate
    },
    claimantAssertions: [
      `The defendant has rejected your settlement agreement`,
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: [
      'You rejected the settlement agreement',
      `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
      `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      ...settlementOfferByInstalments
    },
    claimantAssertions: [
      'The defendant has offered to pay in instalments',
      'View and respond to the offer',
      'If you’ve been paid',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'Your response to the claim',
      `You’ve offered to pay ${fullAdmissionClaim.claim.claimants[0].name} ${NumberFormatter.formatMoney(basePayByInstalmentsData.paymentIntention.repaymentPlan.instalmentAmount)}`,
      `starting ${moment(basePayByInstalmentsData.paymentIntention.repaymentPlan.firstPaymentDate).format('LL')}.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant rejects repayment plan and referred to judge',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantResponse: { ...claimantReferredToJudgeResponseForInstalments }
    },
    claimantAssertions: [
      'Awaiting judge’s review',
      `You’ve rejected the defendant’s repayment plan and an alternative plan suggested by the court.`,
      'A County Court Judgment has been issued against the defendant.',
      `A judge will decide what ${fullAdmissionClaim.claim.defendants[0].name} can afford to pay, based on their financial details.`
    ],
    defendantAssertions: [
      fullAdmissionClaim.claim.claimants[0].name + ' requested a County Court Judgment (CCJ) against you',
      'They rejected your repayment plan.',
      'They also rejected a repayment plan determined by the court, based on the financial details you provided.',
      `When we’ve processed the request we’ll post a copy of the judgment to you and to ${fullAdmissionClaim.claim.claimants[0].name}.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: [
      'You’ve signed a settlement agreement',
      `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
      `They must respond by ${moment(MomentFactory.currentDate().add(7, 'days')).format('LL')}. We’ll email you when they respond.`,
      'If you’ve been paid',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant past counter signature deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: [
      'The defendant has not signed your settlement agreement',
      `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
      'Request a County Court Judgment',
      'If you’ve been paid',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementInInstalments
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in instalments of ${NumberFormatter.formatMoney(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
      `starting ${moment(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.firstPaymentDate).format('LL')}.`,
      'Download the settlement agreement',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says you’ll repay ${NumberFormatter.formatMoney(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
      `starting ${moment(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.firstPaymentDate).format('LL')}.`,
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...settledWithAgreementInInstalmentsPastPaymentDeadline
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in instalments of ${NumberFormatter.formatMoney(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
      'Download the settlement agreement',
      'Tell us you’ve settled',
      'Request County Court Judgment',
      'request a County Court Judgment'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by admission and offered a settlement agreement - defendant rejects settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlan },
      ...defendantRejectedSettlementOfferAcceptInInstalments
    },
    claimantAssertions: [
      `The defendant has rejected your settlement agreement`,
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: [
      'You rejected the settlement agreement',
      `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
      `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: [
      'You’ve signed a settlement agreement',
      `We’ve emailed ${fullAdmissionClaim.claim.defendants[0].name} the repayment plan and the settlement agreement for them to sign.`,
      `They must respond by ${moment(MomentFactory.currentDate().add(7, 'days')).format('LL')}. We’ll email you when they respond.`
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} rejected your repayment plan.`,
      'They accepted a new repayment plan determined by the court, based on the financial details you provided.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant past counter signature deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settlementOfferAcceptInInstalment
    },
    claimantAssertions: [
      'The defendant has not signed your settlement agreement',
      `${fullAdmissionClaim.claim.defendants[0].name} can still sign the settlement agreement until you request a CCJ.`,
      'Request a County Court Judgment'
    ],
    defendantAssertions: [
      `${fullAdmissionClaim.claim.claimants[0].name} asked you to sign a settlement agreement`,
      'They accepted your repayment plan and asked you to sign a settlement agreement to formalise it.',
      'View the repayment plan',
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate(),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settledWithAgreementInInstalments
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in instalments of ${NumberFormatter.formatMoney(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
      `starting ${moment(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.firstPaymentDate).format('LL')}.`,
      'Download the settlement agreement',
      'Tell us you’ve settled'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says you’ll repay ${NumberFormatter.formatMoney(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
      `starting ${moment(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.firstPaymentDate).format('LL')}.`,
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant signed settlement agreement - past payment deadline',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...settledWithAgreementInInstalmentsPastPaymentDeadline
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      `The agreement says the defendant will pay you in instalments of ${NumberFormatter.formatMoney(defendantOffersSettlementByInstalments[0].offer.paymentIntention.repaymentPlan.instalmentAmount)}`,
      'Download the settlement agreement',
      'Tell us you’ve settled',
      'Request County Court Judgment',
      'request a County Court Judgment'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement',
      `Contact ${fullAdmissionClaim.claim.claimants[0].name}`,
      'Download your response'
    ]
  },
  {
    status: 'Full admission - defendant responded pay in instalments - claimant accepts repayment plan by determination and offered a settlement agreement - defendant rejects settlement agreement',
    claim: fullAdmissionClaim,
    claimOverride: {
      response: { ...fullAdmissionClaim.response, ...basePayByInstalmentsData },
      claimantRespondedAt: MomentFactory.currentDate().subtract(8, 'days'),
      claimantResponse: { ...claimantAcceptRepaymentPlanInInstalmentsByDetermination },
      ...defendantRejectedSettlementOfferAcceptInInstalments
    },
    claimantAssertions: [
      `The defendant has rejected your settlement agreement`,
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: [
      'You rejected the settlement agreement',
      `${fullAdmissionClaim.claim.claimants[0].name} can request a County Court Judgment (CCJ) against you.`,
      `If ${fullAdmissionClaim.claim.claimants[0].name} requests a CCJ, you can ask a judge to consider changing the plan, based on your financial details.`,
      'Download your response'
    ]
  }
]

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: fullAdmissionClaim.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: fullAdmissionClaim.externalId })

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
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
                .set('Cookie', `${cookieName} = ABC`)
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
                .set('Cookie', `${cookieName} = ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
