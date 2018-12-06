import { CourtDecision } from 'common/court-calculations/courtDecision'
import { DecisionType } from 'common/court-calculations/decisionType'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Moment } from 'moment'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentOption } from 'claims/models/paymentOption'

export class CourtDecisionHelper {
  static createCourtDecision (claim: Claim, draft: DraftClaimantResponse): DecisionType {
    if (claim.response.defendant.isBusiness()) {
      return DecisionType.NOT_APPLICABLE_IS_BUSINESS
    }

    const defendantLastPaymentDate: Moment = CourtDecisionHelper.getDefendantLastPaymentDate(claim)
    const claimantLastPaymentDate: Moment = CourtDecisionHelper.getClaimantLastPaymentDate(draft)
    const courtOfferedLastDate = CourtDecisionHelper.getCourtOfferedLastDate(claim, draft)

    return CourtDecision.calculateDecision(
      defendantLastPaymentDate,
      claimantLastPaymentDate,
      courtOfferedLastDate
    )
  }

  private static getCourtOfferedLastDate (claim: Claim, draft: DraftClaimantResponse): Moment {
    const courtCalculatedPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
    return courtCalculatedPaymentPlan ? courtCalculatedPaymentPlan.calculateLastPaymentDate() : undefined
  }

  private static getDefendantLastPaymentDate (claim: Claim): Moment {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    return claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS
      ? claimResponse.paymentIntention.repaymentPlan.completionDate
      : claimResponse.paymentIntention.paymentDate
  }

  private static getClaimantLastPaymentDate (draft: DraftClaimantResponse): Moment {
    switch (draft.alternatePaymentMethod.paymentOption.option) {
      case PaymentType.IMMEDIATELY:
        return MomentFactory.currentDate().add(5, 'days')
      case PaymentType.BY_SET_DATE:
        return draft.alternatePaymentMethod.paymentDate.date.toMoment()
      case PaymentType.INSTALMENTS:
        return PaymentPlanHelper.createPaymentPlanFromForm(draft.alternatePaymentMethod.paymentPlan).calculateLastPaymentDate()
      default:
        throw new Error('Unknown claimant payment option!')
    }
  }
}
