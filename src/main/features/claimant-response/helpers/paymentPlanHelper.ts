import { ResponseType } from 'claims/models/response/responseType'
import { generatePaymentPlan, PaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
import { Claim } from 'claims/models/claim'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

export function getDefendantPaymentPlan (claim: Claim): PaymentPlan {
  return getPaymentPlan(claim, (claim.response as FullAdmissionResponse | PartialAdmissionResponse).paymentIntention)
}

export function getPaymentPlan (claim: Claim, paymentIntention: PaymentIntention): PaymentPlan {
  switch (claim.response.responseType) {
    case ResponseType.PART_ADMISSION:
      return generatePaymentPlan(claim.response.amount, paymentIntention.repaymentPlan)
    case ResponseType.FULL_ADMISSION:
      return generatePaymentPlan(claim.claimData.amount.totalAmount(), paymentIntention.repaymentPlan)
    default:
      throw new Error(`Incompatible response type: ${claim.response.responseType}`)
  }
}
