import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import * as moment from 'moment'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentOption } from 'claims/models/paymentOption'

export function getEarliestPaymentDateForPaymentPlan (claim: Claim, claimantPaymentDate: moment.Moment): moment.Moment {
  const monthIncrementDate: moment.Moment = calculateMonthIncrement(moment().startOf('day'))
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
  if (!response) {
    return monthIncrementDate
  }
  const defendantPaymentOption: PaymentOption = response.paymentIntention.paymentOption
  const earliestPermittedDate: moment.Moment = claimantPaymentDate < monthIncrementDate ? monthIncrementDate : claimantPaymentDate

  if (defendantPaymentOption === PaymentOption.IMMEDIATELY || defendantPaymentOption === PaymentOption.BY_SPECIFIED_DATE) {
    return earliestPermittedDate
  }

  const defendantPaymentDate: moment.Moment = response.paymentIntention.repaymentPlan.firstPaymentDate

  return defendantPaymentDate < earliestPermittedDate ? defendantPaymentDate : earliestPermittedDate
}
