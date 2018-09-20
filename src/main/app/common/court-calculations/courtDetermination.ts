import { Moment } from 'moment'
import { Logger } from '@hmcts/nodejs-logging'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentOption } from 'claims/models/paymentOption'
import { Frequency } from 'common/frequency/frequency'

import { checkDefined } from 'shared/preconditions'

const logger = Logger.getLogger('court-determination')

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

function formatDate (date: Moment): string {
  return date.format('YYYY-MM-DD')
}

export class CourtDetermination {

  static determinePaymentDeadline (defendantPaymentDate: Moment,
                                   claimantPaymentDate: Moment,
                                   courtGeneratedPaymentDate: Moment): PaymentDeadline {

    checkDefined(defendantPaymentDate, 'Defendant payment date is required')
    checkDefined(claimantPaymentDate, 'Claimant payment date is required')
    checkDefined(courtGeneratedPaymentDate, 'Court generated payment date is required')

    function log (result: string): void {
      logger.debug(`${result} based on dates (defendant: ${formatDate(defendantPaymentDate)}, claimant: ${formatDate(claimantPaymentDate)}, court: ${formatDate(courtGeneratedPaymentDate)})`)
    }

    if (claimantPaymentDate.isSameOrAfter(defendantPaymentDate) || claimantPaymentDate.isSameOrAfter(courtGeneratedPaymentDate)) {
      log(`Calculator accepted claimant date (${formatDate(claimantPaymentDate)})`)
      return new PaymentDeadline(DecisionType.CLAIMANT, claimantPaymentDate)
    }

    if (claimantPaymentDate.isSameOrBefore(courtGeneratedPaymentDate)) {
      if (defendantPaymentDate.isSameOrBefore(courtGeneratedPaymentDate)) {
        log(`Calculator accepted defendant date (${formatDate(defendantPaymentDate)})`)
        return new PaymentDeadline(DecisionType.DEFENDANT, defendantPaymentDate)
      } else {
        log(`Calculator proposed new date (${formatDate(courtGeneratedPaymentDate)})`)
        return new PaymentDeadline(DecisionType.COURT, courtGeneratedPaymentDate)
      }
    }

    throw new Error(
      `Not able to determine payment deadline based on : '
      ${defendantPaymentDate}, ${claimantPaymentDate}, ${courtGeneratedPaymentDate}'`)
  }

  static determinePaymentIntention (amount: number, paymentDateProposedByDefendant: Moment, claimantPaymentIntention: PaymentIntention, paymentPlanDeterminedFromDefendantFinancialStatement: PaymentPlan): PaymentIntention {
    checkDefined(paymentDateProposedByDefendant, 'Payment date proposed by defendant is required')
    checkDefined(claimantPaymentIntention, 'Claimant payment intention is required')
    checkDefined(paymentPlanDeterminedFromDefendantFinancialStatement, 'Payment plan determined from defendant financial statement is required')

    let paymentDateProposedByClaimant: Moment
    switch (claimantPaymentIntention.paymentOption) {
      case PaymentOption.BY_SPECIFIED_DATE:
        paymentDateProposedByClaimant = claimantPaymentIntention.paymentDate
        break
      case PaymentOption.INSTALMENTS:
        paymentDateProposedByClaimant = PaymentPlan.create(amount, claimantPaymentIntention.repaymentPlan.instalmentAmount, Frequency.of(claimantPaymentIntention.repaymentPlan.paymentSchedule), claimantPaymentIntention.repaymentPlan.firstPaymentDate).calculateLastPaymentDate()
        break
      default:
        throw new Error(`Payment option is not supported: ${claimantPaymentIntention.paymentOption}`)
    }

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
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanDeterminedFromDefendantFinancialStatement.frequency),
          firstPaymentDate: paymentPlanDeterminedFromDefendantFinancialStatement.startDate
        }
        break
    }

    return paymentIntention
  }

}
