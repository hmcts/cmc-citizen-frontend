import { Moment } from 'moment'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { AdmissionHelper } from 'shared/helpers/admissionHelper'

export class PaymentDeadlineHelper {
  static getPaymentDeadlineFromAdmission (claim: Claim): Moment {
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (response.responseType !== ResponseType.FULL_ADMISSION && response.responseType !== ResponseType.PART_ADMISSION) {
      throw new Error(`Non admission responses are not supported: ${response}`)
    }

    const paymentIntention: PaymentIntention = response.paymentIntention
    if (paymentIntention === undefined) {
      throw new Error('Admission payment intention is missing, most likely claim has been declared paid')
    }

    switch (paymentIntention.paymentOption) {
      case PaymentOption.IMMEDIATELY:
      case PaymentOption.BY_SPECIFIED_DATE:
        return paymentIntention.paymentDate
      case PaymentOption.INSTALMENTS:
        return PaymentPlan.create(
          AdmissionHelper.getAdmittedAmount(claim),
          paymentIntention.repaymentPlan.instalmentAmount,
          Frequency.of(paymentIntention.repaymentPlan.paymentSchedule),
          paymentIntention.repaymentPlan.firstPaymentDate
        ).calculateLastPaymentDate()
      default:
        throw new Error(`Unknown payment option: ${paymentIntention.paymentOption}`)
    }
  }
}
