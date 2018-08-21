import { Claim } from 'claims/models/claim'

import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse'
import { ResponseDraft } from 'features/response/draft/responseDraft'

import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { CourtOrder } from 'common/court-order/courtOrder'
import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'

export class CourtOrderHelper {

  static calculateCourtOrderAmount (claim: Claim, draft: DraftClaimantResponse | ResponseDraft): CourtOrder {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const claimPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
    const draftPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft)

    const defendantMonthlyInstalmentAmount: number = claimPaymentPlan.convertTo(Frequency.MONTHLY).instalmentAmount
    const claimantMonthlyInstalmentAmount: number = draftPaymentPlan.convertTo(Frequency.MONTHLY).instalmentAmount
    const defendantMonthlyDisposableIncome: number = StatementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(claimResponse.statementOfMeans)

    const courtOrder: CourtOrder = new CourtOrder(
      defendantMonthlyInstalmentAmount, 
      claimantMonthlyInstalmentAmount, 
      defendantMonthlyDisposableIncome
    )

    return courtOrder
  }
}
