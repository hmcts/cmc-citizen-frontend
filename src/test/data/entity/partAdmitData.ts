import { MomentFactory } from 'shared/momentFactory'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { basePartialAdmissionData, baseResponseData, basePartialEvidencesAndTimeLines } from './responseData'

function immediatePaymentIntention () {
  return {
    paymentDate: MomentFactory.currentDate().add(5, 'days'),
    paymentOption: PaymentOption.IMMEDIATELY
  }
}

function bySetByDatePaymentIntention () {
  return {
    paymentDate: MomentFactory.currentDate().add(30, 'days'),
    paymentOption: PaymentOption.BY_SPECIFIED_DATE
  }
}

function bySetByDatePaymentIntentionPastDeadline () {
  return {
    paymentDate: MomentFactory.currentDate().subtract(1, 'days'),
    paymentOption: PaymentOption.BY_SPECIFIED_DATE
  }
}

function instalmentsPaymentIntentionPastDeadline () {
  return {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      completionDate: MomentFactory.currentDate().subtract(12, 'months'),
      firstPaymentDate: MomentFactory.currentDate().subtract(1, 'days'),
      instalmentAmount: 10,
      paymentLength: '10 months',
      paymentSchedule: PaymentSchedule.EVERY_MONTH
    }
  }
}

export function instalmentsPaymentIntention () {
  return {
    paymentOption: PaymentOption.INSTALMENTS,
    repaymentPlan: {
      completionDate: MomentFactory.currentDate().add(12, 'months'),
      firstPaymentDate: MomentFactory.currentDate().add(15, 'days'),
      instalmentAmount: 10,
      paymentLength: '10 months',
      paymentSchedule: PaymentSchedule.EVERY_MONTH
    }
  }
}

function courtDeterminationBySpecifiedDate () {
  return {
    courtDecision: {
      ...bySetByDatePaymentIntention()
    },
    courtPaymentIntention: {
      paymentDate: MomentFactory.maxDate(),
      paymentOption: PaymentOption.BY_SPECIFIED_DATE,
      decisionType: 'DEFENDANT',
      rejectionReason: 'test'
    }
  }
}

function courtDeterminationInInstalments () {
  return {
    courtDecision: {
      ...instalmentsPaymentIntention()
    },
    courtPaymentIntention: {
      paymentDate: MomentFactory.maxDate(),
      paymentOption: PaymentOption.BY_SPECIFIED_DATE,
      decisionType: 'DEFENDANT',
      rejectionReason: 'test'
    }
  }
}

export function claimantReferredToJudgeResponse () {
  return {
    claimantPaymentIntention: { ...immediatePaymentIntention() },
    courtDetermination: { ...courtDeterminationBySpecifiedDate() },
    formaliseOption: FormaliseOption.REFER_TO_JUDGE,
    type: ClaimantResponseType.ACCEPTATION
  }
}

export function claimantReferredToJudgeResponseForInstalments () {
  return {
    claimantPaymentIntention: { ...immediatePaymentIntention() },
    courtDetermination: { ...courtDeterminationInInstalments() },
    formaliseOption: FormaliseOption.REFER_TO_JUDGE,
    type: ClaimantResponseType.ACCEPTATION
  }
}

export const claimantAcceptRepaymentPlan = {
  formaliseOption: FormaliseOption.SETTLEMENT,
  type: ClaimantResponseType.ACCEPTATION
}

export function claimantAcceptRepaymentPlanByDetermination () {
  return {
    claimantPaymentIntention: { ...immediatePaymentIntention() },
    courtDetermination: { ...courtDeterminationBySpecifiedDate() },
    ...claimantAcceptRepaymentPlan
  }
}

export function claimantAcceptRepaymentPlanInInstalmentsByDetermination () {
  return {
    claimantPaymentIntention: { ...immediatePaymentIntention() },
    courtDetermination: { ...courtDeterminationInInstalments() },
    ...claimantAcceptRepaymentPlan
  }
}

function defendantOffersSettlementBySetDate () {
  return [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'test',
      completionDate: MomentFactory.currentDate().add(1, 'day'),
      paymentIntention: { ...bySetByDatePaymentIntention() }
    }
  }]
}

function defendantOffersSettlementByInstalments () {
  return [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'test',
      completionDate: MomentFactory.currentDate().add(12, 'months'),
      paymentIntention: { ...instalmentsPaymentIntention() }
    }
  }]
}

function defendantOffersSettlementBySetDatePastPaymentDeadline () {
  return [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'test',
      completionDate: MomentFactory.currentDate().subtract(2, 'day'),
      paymentIntention: { ...bySetByDatePaymentIntentionPastDeadline() }
    }
  }]
}

function defendantOffersSettlementInInstalmentsPastPaymentDeadline () {
  return [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'test',
      completionDate: MomentFactory.currentDate().add(12, 'months'),
      paymentIntention: { ...instalmentsPaymentIntentionPastDeadline() }
    }
  }]
}

const claimantAcceptOffer = [{
  madeBy: 'CLAIMANT',
  type: 'ACCEPTATION'
}]

const defendantCounterSign = [{
  madeBy: 'DEFENDANT',
  type: 'COUNTERSIGNATURE'
}]

const defendantRejected = [{
  madeBy: 'DEFENDANT',
  type: 'REJECTION'
}]

export function settledWithAgreementBySetDate () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementBySetDate(),
        ...claimantAcceptOffer,
        ...defendantCounterSign
      ]
    },
    settlementReachedAt: MomentFactory.currentDate()
  }
}

export function settledWithAgreementInInstalments () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementByInstalments(),
        ...claimantAcceptOffer,
        ...defendantCounterSign
      ]
    },
    settlementReachedAt: MomentFactory.currentDate()
  }
}

export function defendantRejectedSettlementOfferAcceptBySetDate () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementBySetDate(),
        ...claimantAcceptOffer,
        ...defendantRejected
      ]
    },
    settlementReachedAt: MomentFactory.currentDate()
  }
}

export function defendantRejectedSettlementOfferAcceptInInstalments () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementByInstalments(),
        ...claimantAcceptOffer,
        ...defendantRejected
      ]
    },
    settlementReachedAt: MomentFactory.currentDate()
  }
}

export function settledWithAgreementBySetDatePastPaymentDeadline () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementBySetDatePastPaymentDeadline(),
        ...claimantAcceptOffer,
        ...defendantCounterSign
      ]
    },
    settlementReachedAt: MomentFactory.currentDate().subtract(7, 'days')
  }
}

export function settledWithAgreementInInstalmentsPastPaymentDeadline () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementInInstalmentsPastPaymentDeadline(),
        ...claimantAcceptOffer,
        ...defendantCounterSign
      ]
    },
    settlementReachedAt: MomentFactory.currentDate().subtract(7, 'days')
  }
}

export function settlementOfferAcceptBySetDate () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementBySetDate(),
        ...claimantAcceptOffer
      ]
    }
  }
}

export function settlementOfferAcceptInInstalment () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementByInstalments(),
        ...claimantAcceptOffer
      ]
    }
  }
}

export function settlementOfferBySetDate () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementBySetDate()
      ]
    }
  }
}

export function settlementOfferByInstalments () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlementByInstalments()
      ]
    }
  }
}

export const partialAdmissionAlreadyPaidData = {
  ...baseResponseData,
  ...basePartialAdmissionData,
  ...basePartialEvidencesAndTimeLines,
  amount: 100,
  defence: 'i have paid more than enough',
  paymentDeclaration: {
    paidDate: '2050-12-31',
    explanation: 'i have already paid enough'
  }
}
