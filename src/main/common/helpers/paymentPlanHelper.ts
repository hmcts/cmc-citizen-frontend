import { Moment } from 'moment'

import { Frequency } from 'common/frequency/frequency'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse'
import { ResponseDraft } from 'features/response/draft/responseDraft'

import { PaymentPlan as DraftPaymentPlan } from 'main/common/components/payment-intention/model/paymentPlan'
import { PaymentPlan as FormPaymentPlan } from 'shared/components/payment-intention/model/paymentPlan'
import { Error } from 'tslint/lib/error'
import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculate-month-increment'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentIntention as PI } from 'claims/models/response/core/paymentIntention'

export class PaymentPlanHelper {

  static createPaymentPlanFromClaim (claim: Claim): PaymentPlan {
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (!response) {
      return undefined
    }

    const responseType: ResponseType = response.responseType

    switch (responseType) {
      case ResponseType.PART_ADMISSION:
        return PaymentPlanHelper.createPaymentPlanFromClaimPartialAdmission(response as PartialAdmissionResponse,
          claim.claimData.amount.totalAmount())
      case ResponseType.FULL_ADMISSION:
        return PaymentPlanHelper.createPaymentPlanFromClaimFullAdmission(
          response as FullAdmissionResponse,
          claim.claimData.amount.totalAmount()
        )
      default:
        throw new Error(`Incompatible response type: ${responseType}`)
    }
  }

  static createPaymentPlanFromClaimWhenSetDate (response: PartialAdmissionResponse | FullAdmissionResponse, totalAmount: number): PaymentPlan {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = response as FullAdmissionResponse | PartialAdmissionResponse

    return PaymentPlanHelper.createPaymentPlan(
      totalAmount,
      StatementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(claimResponse.statementOfMeans),
      PaymentSchedule.EVERY_MONTH,
      calculateMonthIncrement(response.paymentIntention.paymentDate)) // not sure if this is correct date to pass as param
  }

  static createPaymentPlanFromDraft (draft: DraftClaimantResponse | ResponseDraft): PaymentPlan {
    switch (draft.constructor) {
      case DraftClaimantResponse:
        return PaymentPlanHelper.createPaymentPlanFromDraftDraftClaimantResponse(draft as DraftClaimantResponse)
      case ResponseDraft:
        throw new Error(`Draft object of type 'ResponseDraft' not yet supported`)
      default:
        throw new Error(`Incompatible draft object: ${draft}`)
    }
  }

  static createPaymentPlanFromForm (paymentPlanForm: FormPaymentPlan): PaymentPlan {
    if (!paymentPlanForm) {
      return undefined
    }

    return PaymentPlanHelper.createPaymentPlan(
      paymentPlanForm.totalAmount,
      paymentPlanForm.instalmentAmount,
      paymentPlanForm.paymentSchedule ? paymentPlanForm.paymentSchedule.value : undefined,
      undefined)
  }

  private static createPaymentPlanFromClaimPartialAdmission (response: PartialAdmissionResponse, totalAmount: number): PaymentPlan {
    const paymentIntention: PI = response.paymentIntention
    if (!paymentIntention) {
      return undefined
    }

    if (paymentIntention.repaymentPlan) {
      return PaymentPlanHelper.createPaymentPlan(
        response.amount,
        paymentIntention.repaymentPlan.instalmentAmount,
        paymentIntention.repaymentPlan.paymentSchedule,
        paymentIntention.repaymentPlan.firstPaymentDate
      )
    }

    if (paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
      PaymentPlanHelper.createPaymentPlanFromClaimWhenSetDate(response, totalAmount)
    }
  }

  private static createPaymentPlanFromClaimFullAdmission (response: FullAdmissionResponse, totalAmount: number): PaymentPlan {
    const paymentIntention: PI = response.paymentIntention
    if (!paymentIntention) {
      return undefined
    }

    if (paymentIntention.repaymentPlan) {
      return PaymentPlanHelper.createPaymentPlan(
        totalAmount,
        paymentIntention.repaymentPlan.instalmentAmount,
        paymentIntention.repaymentPlan.paymentSchedule,
        paymentIntention.repaymentPlan.firstPaymentDate
      )
    }

    if (paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
      PaymentPlanHelper.createPaymentPlanFromClaimWhenSetDate(response, totalAmount)
    }
  }

  private static createPaymentPlanFromDraftDraftClaimantResponse (draft: DraftClaimantResponse): PaymentPlan {
    if (!draft) {
      return undefined
    }

    return PaymentPlanHelper.createPaymentPlanFromDraftPaymentIntention(draft.alternatePaymentMethod)
  }

  private static createPaymentPlanFromDraftPaymentIntention (paymentIntention: PaymentIntention): PaymentPlan {
    const paymentPlan: DraftPaymentPlan = paymentIntention.paymentPlan
    if (!paymentPlan) {
      return undefined
    }

    return PaymentPlanHelper.createPaymentPlan(
      paymentPlan.totalAmount,
      paymentPlan.instalmentAmount,
      paymentPlan.paymentSchedule ? paymentPlan.paymentSchedule.value : undefined,
      paymentPlan.firstPaymentDate ? paymentPlan.firstPaymentDate.toMoment() : undefined
    )
  }

  private static createPaymentPlan (totalAmount: number, instalmentAmount: number, frequency: string, firstPaymentDate: Moment): PaymentPlan {
    if (!totalAmount || !instalmentAmount || !frequency) {
      return undefined
    }

    return PaymentPlan.create(totalAmount, instalmentAmount, Frequency.of(frequency), firstPaymentDate)
  }
}
