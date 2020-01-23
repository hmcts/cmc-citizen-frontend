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
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentIntention as PI } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { AdmissionHelper } from 'shared/helpers/admissionHelper'

export class PaymentPlanHelper {

  static createPaymentPlanFromClaim (claim: Claim, draft: DraftClaimantResponse): PaymentPlan {
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (!response) {
      return undefined
    }

    const responseType: ResponseType = response.responseType

    switch (responseType) {
      case ResponseType.PART_ADMISSION:
        let partialAdmissionResponse = response as PartialAdmissionResponse
        return PaymentPlanHelper.createPaymentPlanFromClaimAdmission(partialAdmissionResponse,
          partialAdmissionResponse.amount,
          draft
        )
      case ResponseType.FULL_ADMISSION:
        return PaymentPlanHelper.createPaymentPlanFromClaimAdmission(response as FullAdmissionResponse,
          claim.totalAmountTillToday,
          draft
        )
      default:
        throw new Error(`Incompatible response type: ${responseType}`)
    }
  }

  private static createPaymentPlanFromClaimAdmission (response: FullAdmissionResponse | PartialAdmissionResponse,
                                                      totalAmount: number,
                                                      draft: DraftClaimantResponse): PaymentPlan {
    const paymentIntention: PI = response.paymentIntention
    if (!paymentIntention) {
      return undefined
    }

    if (paymentIntention.repaymentPlan) {
      return PaymentPlanHelper.createPaymentPlanFromInstallment(
        totalAmount,
        paymentIntention.repaymentPlan.instalmentAmount,
        Frequency.of(paymentIntention.repaymentPlan.paymentSchedule),
        paymentIntention.repaymentPlan.firstPaymentDate
      )
    }

    if (draft.courtDetermination.disposableIncome <= 0) {
      return PaymentPlanHelper.createPaymentPlanFromStartDate(MomentFactory.maxDate())
    }

    if (paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
      const instalmentAmount: number = draft.courtDetermination.disposableIncome / Frequency.WEEKLY.monthlyRatio
      return PaymentPlanHelper.createPaymentPlanFromInstallment(totalAmount, instalmentAmount, Frequency.WEEKLY, calculateMonthIncrement(MomentFactory.currentDate()))
    }
  }

  static createPaymentPlanFromDefendantFinancialStatement (claim: Claim, draft: DraftClaimantResponse): PaymentPlan {
    const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const frequency: Frequency = response.paymentIntention.paymentOption === PaymentOption.INSTALMENTS ?
      Frequency.of(response.paymentIntention.repaymentPlan.paymentSchedule) : Frequency.WEEKLY

    if (claim.claimData.defendant.isBusiness()) {
      return undefined
    }

    if (response === undefined) {
      throw new Error('Claim does not have response attached')
    }
    if (response.statementOfMeans === undefined) {
      throw new Error(`Claim response does not have financial statement attached`)
    }

    const instalmentAmount: number = Math.min(draft.courtDetermination.disposableIncome / frequency.monthlyRatio, claim.totalAmountTillToday)
    if (instalmentAmount < 1) {
      return PaymentPlanHelper.createPaymentPlanFromStartDate(MomentFactory.maxDate())
    }

    return PaymentPlanHelper.createPaymentPlanFromInstallment(AdmissionHelper.getAdmittedAmount(claim), instalmentAmount, frequency, calculateMonthIncrement(MomentFactory.currentDate()))
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

    return PaymentPlanHelper.createPaymentPlanFromInstallment(
      paymentPlanForm.totalAmount,
      paymentPlanForm.instalmentAmount,
      paymentPlanForm.paymentSchedule ? Frequency.of(paymentPlanForm.paymentSchedule.value) : undefined,
      paymentPlanForm.firstPaymentDate ? paymentPlanForm.firstPaymentDate.toMoment() : undefined)
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

    return PaymentPlanHelper.createPaymentPlanFromInstallment(
      paymentPlan.totalAmount,
      paymentPlan.instalmentAmount,
      paymentPlan.paymentSchedule ? Frequency.of(paymentPlan.paymentSchedule.value) : undefined,
      paymentPlan.firstPaymentDate ? paymentPlan.firstPaymentDate.toMoment() : undefined
    )
  }

  private static createPaymentPlanFromInstallment (totalAmount: number, instalmentAmount: number, frequency: Frequency, firstPaymentDate: Moment): PaymentPlan {
    if (!totalAmount || !instalmentAmount || !frequency) {
      return undefined
    }

    return PaymentPlan.create(totalAmount, instalmentAmount, frequency, firstPaymentDate)
  }

  private static createPaymentPlanFromStartDate (firstPaymentDate: Moment): PaymentPlan {
    return PaymentPlan.create(0, 0, Frequency.WEEKLY, firstPaymentDate)
  }
}
