import { Moment } from 'moment'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentOption } from 'claims/models/paymentOption'
import { Frequency } from 'common/frequency/frequency'

export enum DecisionType {
  CLAIMANT = 'CLAIMANT',
  DEFENDANT = 'DEFENDANT',
  COURT = 'COURT'
}

export class PaymentDeadline {
  constructor (
    readonly source: DecisionType,
    readonly date: Moment
  ) {}
}

export class CourtDetermination {

  static determinePaymentDeadline (defendantPaymentDate: Moment,
                                   claimantPaymentDate: Moment,
                                   courtGeneratedPaymentDate: Moment): PaymentDeadline {

    if (!defendantPaymentDate || !claimantPaymentDate || !courtGeneratedPaymentDate) {
      throw new Error('Input should be a moment, cannot be empty')
    }

    if (claimantPaymentDate.isSameOrAfter(defendantPaymentDate) || claimantPaymentDate.isSameOrAfter(courtGeneratedPaymentDate)) {
      return new PaymentDeadline(DecisionType.CLAIMANT, claimantPaymentDate)
    }
    if (claimantPaymentDate.isSameOrBefore(courtGeneratedPaymentDate)) {
      if (defendantPaymentDate.isSameOrBefore(courtGeneratedPaymentDate)) {
        return new PaymentDeadline(DecisionType.DEFENDANT, defendantPaymentDate)
      } else {
        return new PaymentDeadline(DecisionType.COURT, courtGeneratedPaymentDate)
      }
    }
    throw new Error(
      `Not able to determine payment deadline based on : '
      ${defendantPaymentDate}, ${claimantPaymentDate}, ${courtGeneratedPaymentDate}'`)
  }

  static determinePaymentIntention (paymentDateProposedByDefendant: Moment, claimantPaymentIntention: PaymentIntention, paymentPlanDeterminedFromDefendantFinancialStatement: PaymentPlan): PaymentIntention {
    const paymentDateProposedByClaimant: Moment = claimantPaymentIntention.paymentDate

    const courtDecision: PaymentDeadline = CourtDetermination.determinePaymentDeadline(
      paymentDateProposedByDefendant,
      paymentDateProposedByClaimant,
      paymentPlanDeterminedFromDefendantFinancialStatement.calculateLastPaymentDate()
    )

    const paymentIntention = new PaymentIntention()
    paymentIntention.paymentOption = claimantPaymentIntention.paymentOption
    switch (claimantPaymentIntention.paymentOption) {
      case PaymentOption.BY_SPECIFIED_DATE:
        paymentIntention.paymentDate = courtDecision.date
        break
      case PaymentOption.INSTALMENTS:
        paymentIntention.repaymentPlan = {
          instalmentAmount: paymentPlanDeterminedFromDefendantFinancialStatement.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanDeterminedFromDefendantFinancialStatement.frequency) as any, // TODO: convert to payment schedule
          firstPaymentDate: paymentPlanDeterminedFromDefendantFinancialStatement.startDate
        }
        break
    }

    return paymentIntention
  }

}
