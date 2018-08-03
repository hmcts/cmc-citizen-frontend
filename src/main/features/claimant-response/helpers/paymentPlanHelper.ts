import { ResponseType } from 'claims/models/response/responseType'
import { generatePaymentPlan, PaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
import { Claim } from 'claims/models/claim'

export function getPaymentPlan (claim: Claim): PaymentPlan {
  switch (claim.response.responseType) {
    case ResponseType.PART_ADMISSION:
      return generatePaymentPlan(claim.response.amount, claim.response.paymentIntention.repaymentPlan)
    case ResponseType.FULL_ADMISSION:
      return generatePaymentPlan(claim.claimData.amount.totalAmount(), claim.response.paymentIntention.repaymentPlan)
    default:
      throw new Error(`Incompatible response type: ${claim.response.responseType}`)
  }
}
