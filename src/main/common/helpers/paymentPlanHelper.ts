import { Frequency } from 'common/frequency/frequency'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'

import { PaymentPlan as PaymentPlanForm } from 'shared/components/payment-intention/model/paymentPlan'

export class PaymentPlanHelper {

  static createPaymentPlanFromClaim (claim: Claim): PaymentPlan {
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (!response) {
      return undefined
    }

    const responseType: ResponseType = response.responseType

    switch (responseType) {
      case ResponseType.PART_ADMISSION:
        return PaymentPlanHelper.createPaymentPlanFromPartialAdmission(response as PartialAdmissionResponse)
      case ResponseType.FULL_ADMISSION:
        return PaymentPlanHelper.createPaymentPlanFromFullAdmission(response as FullAdmissionResponse, claim.claimData.amount.totalAmount())
      default:
        throw new Error(`Incompatible response type: ${responseType}`)
    }
  }

  static createPaymentPlanFromForm (paymentPlanForm: PaymentPlanForm): PaymentPlan {
    if (!paymentPlanForm) {
      return undefined
    }

    return PaymentPlanHelper.createPaymentPlan(
      paymentPlanForm.totalAmount, 
      paymentPlanForm.instalmentAmount, 
      paymentPlanForm.paymentSchedule ? paymentPlanForm.paymentSchedule.value : undefined)
  }

  private static createPaymentPlanFromPartialAdmission (response: PartialAdmissionResponse): PaymentPlan {
    const repaymentPlan: RepaymentPlan = response.paymentIntention.repaymentPlan
    if (!repaymentPlan) {
      return undefined
    }
    return PaymentPlanHelper.createPaymentPlan(response.amount, repaymentPlan.instalmentAmount, repaymentPlan.paymentSchedule)
  }

  private static createPaymentPlanFromFullAdmission (response: FullAdmissionResponse, totalAmount: number): PaymentPlan {
    const repaymentPlan: RepaymentPlan = response.paymentIntention.repaymentPlan
    if (!repaymentPlan) {
      return undefined
    }
    return PaymentPlanHelper.createPaymentPlan(totalAmount, repaymentPlan.instalmentAmount, repaymentPlan.paymentSchedule)
  }

  private static createPaymentPlan (totalAmount: number, instalmentAmount: number, frequency: string): PaymentPlan {
    if (!totalAmount || !instalmentAmount || !frequency) {
      return undefined
    }
    return PaymentPlan.create(totalAmount, instalmentAmount, Frequency.of(frequency))
  }

  // static getDefendantPaymentPlanAmountFrom(claim: Claim)
	// static getDefendantPaymentPlanFrequencyFrom(claim: Claim)
  // static getDefendantMonthlyPaymentPlanAmountFrom(claim: Claim)

  // static getClaimantPaymentPlanFrequencyFrom(draft)
  // static getClaimantMonthlyPaymentPlanAmountFrom(draft)


  // const paymentPlan = createPaymentPlan (
    
  // )

  // paymentPlan.getTotalAmount()
  // paymentPlan.getInstalmentAmount()
  // paymentPlan.getMontlhlyInstalmentAmount()
  // paymentPlan.getFrequency()
}
