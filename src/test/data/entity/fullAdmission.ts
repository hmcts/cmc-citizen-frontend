import { MomentFactory } from 'shared/momentFactory'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

export const immediatePaymentIntention = {
  paymentDate: MomentFactory.currentDate().add(5, 'days'),
  paymentOption: PaymentOption.IMMEDIATELY
}

export const setByDatePaymentIntention = {
  paymentDate: MomentFactory.currentDate().add(30, 'days'),
  paymentOption: PaymentOption.BY_SPECIFIED_DATE
}

export const setByDatePaymentIntentionPastDeadline = {
  paymentDate: MomentFactory.currentDate().subtract(1, 'days'),
  paymentOption: PaymentOption.BY_SPECIFIED_DATE
}

export const installmentsPaymentIntentionPastDeadline = {
  paymentOption: PaymentOption.INSTALMENTS,
  repaymentPlan: {
    completionDate: MomentFactory.currentDate().subtract(12, 'months'),
    firstPaymentDate: MomentFactory.currentDate().subtract(1, 'days'),
    installmentAmount: 10,
    paymentLength: '10 months',
    paymentSchedule: PaymentSchedule.EVERY_MONTH
  }
}

export const installmentsPaymentIntention = {
  paymentOption: PaymentOption.INSTALMENTS,
  repaymentPlan: {
    completionDate: MomentFactory.currentDate().add(12, 'months'),
    firstPaymentDate: MomentFactory.currentDate().add(15, 'days'),
    installmentAmount: 10,
    paymentLength: '10 months',
    paymentSchedule: PaymentSchedule.EVERY_MONTH
  }

}

export const courtDeterminationBySpecifiedDate = {
  courtDecision: {
    ...setByDatePaymentIntention
  },
  courtPaymentIntention: {
    paymentDate: MomentFactory.maxDate(),
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    decisionType: 'DEFENDANT',
    rejectionReason: 'test'
  }
}

export const courtDeterminationInInstalments = {
  courtDecision: {
    ...installmentsPaymentIntention
  },
  courtPaymentIntention: {
    paymentDate: MomentFactory.maxDate(),
    paymentOption: PaymentOption.BY_SPECIFIED_DATE,
    decisionType: 'DEFENDANT',
    rejectionReason: 'test'
  }
}

export const claimantReferredToJudgeResponse = {
  claimantPaymentIntention: { ...immediatePaymentIntention },
  courtDetermination: { ...courtDeterminationBySpecifiedDate },
  formaliseOption: FormaliseOption.REFER_TO_JUDGE,
  type: ClaimantResponseType.ACCEPTATION
}

export const claimantReferredToJudgeResponseForInstalments = {
  claimantPaymentIntention: { ...immediatePaymentIntention },
  courtDetermination: { ...courtDeterminationInInstalments },
  formaliseOption: FormaliseOption.REFER_TO_JUDGE,
  type: ClaimantResponseType.ACCEPTATION
}

export const claimantAcceptRepaymentPlan = {
  formaliseOption: FormaliseOption.SETTLEMENT,
  type: ClaimantResponseType.ACCEPTATION
}

export const claimantAcceptRepaymentPlanByDetermination = {
  claimantPaymentIntention: { ...immediatePaymentIntention },
  courtDetermination: { ...courtDeterminationBySpecifiedDate },
  ...claimantAcceptRepaymentPlan
}

export const claimantAcceptRepaymentPlanInInstalmentsByDetermination = {
  claimantPaymentIntention: { ...immediatePaymentIntention },
  courtDetermination: { ...courtDeterminationInInstalments },
  ...claimantAcceptRepaymentPlan
}

export const claimantResponseAt = {
  claimantRespondedAt: MomentFactory.currentDate()
}

export const defendantOffersSettlementBySetDate = [{
  type: 'OFFER',
  madeBy: 'DEFENDANT',
  offer: {
    content: 'test',
    completionDate: MomentFactory.currentDate().add(1, 'day'),
    paymentIntention: { ...setByDatePaymentIntention }
  }
}]

export const defendantOffersSettlementByInstallments = [{
  type: 'OFFER',
  madeBy: 'DEFENDANT',
  offer: {
    content: 'test',
    completionDate: MomentFactory.currentDate().add(1, 'day'),
    paymentIntention: { ...installmentsPaymentIntention }
  }
}]

export const defendantOffersSettlementBySetDatePastPaymentDeadline = [{
  type: 'OFFER',
  madeBy: 'DEFENDANT',
  offer: {
    content: 'test',
    completionDate: MomentFactory.currentDate().subtract(2, 'day'),
    paymentIntention: { ...setByDatePaymentIntentionPastDeadline }
  }
}]

export const defendantOffersSettlementInInstalmentsPastPaymentDeadline = [{
  type: 'OFFER',
  madeBy: 'DEFENDANT',
  offer: {
    content: 'test',
    completionDate: MomentFactory.currentDate().add(12, 'months'),
    paymentIntention: { ...installmentsPaymentIntentionPastDeadline }
  }
}]

export const claimantAcceptOffer = [{
  madeBy: 'CLAIMANT',
  type: 'ACCEPTATION'
}]

export const defendantCounterSign = [{
  madeBy: 'DEFENDANT',
  type: 'COUNTERSIGNATURE'
}]

export const defendantRejected = [{
  madeBy: 'DEFENDANT',
  type: 'REJECTION'
}]

export const settledWithAgreementBySetDate = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementBySetDate,
      ...claimantAcceptOffer,
      ...defendantCounterSign
    ]
  },
  settlementReachedAt: MomentFactory.currentDate()
}

export const settledWithAgreementInInstalments = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementByInstallments,
      ...claimantAcceptOffer,
      ...defendantCounterSign
    ]
  },
  settlementReachedAt: MomentFactory.currentDate()
}

export const defendantRejectedSettlementOfferAcceptBySetDate = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementBySetDate,
      ...claimantAcceptOffer,
      ...defendantRejected
    ]
  },
  settlementReachedAt: MomentFactory.currentDate()
}

export const defendantRejectedSettlementOfferAcceptInInstalments = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementByInstallments,
      ...claimantAcceptOffer,
      ...defendantRejected
    ]
  },
  settlementReachedAt: MomentFactory.currentDate()
}

export const settledWithAgreementBySetDatePastPaymentDeadline = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementBySetDatePastPaymentDeadline,
      ...claimantAcceptOffer,
      ...defendantCounterSign
    ]
  },
  settlementReachedAt: MomentFactory.currentDate().subtract(7, 'days')
}

export const settledWithAgreementInInstalmentsPastPaymentDeadline = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementInInstalmentsPastPaymentDeadline,
      ...claimantAcceptOffer,
      ...defendantCounterSign
    ]
  },
  settlementReachedAt: MomentFactory.currentDate().subtract(7, 'days')
}

export const settlementOfferAcceptBySetDate = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementBySetDate,
      ...claimantAcceptOffer
    ]
  }
}

export const settlementOfferAcceptInInstalment = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementByInstallments,
      ...claimantAcceptOffer
    ]
  }
}

export const settlementOfferBySetDate = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementBySetDate
    ]
  }
}

export const settlementOfferByInstallments = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlementByInstallments
    ]
  }
}
