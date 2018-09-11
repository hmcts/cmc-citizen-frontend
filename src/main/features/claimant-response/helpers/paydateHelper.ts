import { calculateMonthIncrement } from 'common/calculate-month-increment/calculate-month-increment'
import * as moment from 'moment'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentOption } from 'claims/models/paymentOption'

export function getEarliestPaymentDateForAlternatePaymentInstalments (claim: Claim, claimantPaymentDate: moment.Moment): moment.Moment {

  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
  const defendantPaymentOption: PaymentOption = response.paymentIntention.paymentOption
  const monthIncrementDate: moment.Moment = calculateMonthIncrement(moment())
  const earliestPermittedDate: moment.Moment = claimantPaymentDate < monthIncrementDate ? monthIncrementDate : claimantPaymentDate
  const defendantPaymentDate: moment.Moment = defendantPaymentOption === PaymentOption.INSTALMENTS ?
    response.paymentIntention.repaymentPlan.firstPaymentDate : response.paymentIntention.paymentDate

  return defendantPaymentOption === PaymentOption.BY_SPECIFIED_DATE ?
    earliestPermittedDate : defendantPaymentDate < earliestPermittedDate ? defendantPaymentDate : earliestPermittedDate

}
