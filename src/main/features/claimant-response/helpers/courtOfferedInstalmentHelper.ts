import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import * as _ from 'lodash'

export class CourtOfferedInstalmentHelper {
  static getCourtOfferedInstalmentAmount (
    paymentPlanConvertedToDefendantFrequency: PaymentPlan,
    defendantPaymentPlan: PaymentPlan): number {

    if (paymentPlanConvertedToDefendantFrequency.instalmentAmount > Frequency.WEEKLY.monthlyRatio) {
      return paymentPlanConvertedToDefendantFrequency.instalmentAmount
    } else {
      if (_.inRange(paymentPlanConvertedToDefendantFrequency.instalmentAmount, 1, Frequency.WEEKLY.monthlyRatio)
        && defendantPaymentPlan.frequency === Frequency.MONTHLY) {
        return paymentPlanConvertedToDefendantFrequency.instalmentAmount
      } else {
        return defendantPaymentPlan.instalmentAmount
      }
    }
  }
}
