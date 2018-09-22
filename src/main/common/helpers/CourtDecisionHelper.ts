import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Moment } from 'moment'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

export class CourtDecisionHelper {
  static createCourtDecision (claim: Claim, draft: Draft<DraftClaimantResponse>): DecisionType {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtCalculatedPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    const defendantPaymentPlanWhenInstalment: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

    const defendantEnteredPayBySetDate: Moment = claimResponse.paymentIntention.paymentDate
    const defendantInstalmentLastDate: Moment = defendantPaymentPlanWhenInstalment.calculateLastPaymentDate()

    const courtOfferedLastDate: Moment = courtCalculatedPaymentPlan.calculateLastPaymentDate()
    const defendantLastPaymentDate: Moment = defendantEnteredPayBySetDate ? defendantInstalmentLastDate : defendantEnteredPayBySetDate
    const claimantEnteredPayBySetDate: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()

    return CourtDetermination.calculateDecision(
      defendantLastPaymentDate,
      claimantEnteredPayBySetDate,
      courtOfferedLastDate
    )
  }
}
