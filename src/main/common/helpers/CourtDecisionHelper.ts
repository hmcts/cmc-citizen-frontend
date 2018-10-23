import { CourtDecision, DecisionType } from 'common/court-calculations/courtDecision'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Moment } from 'moment'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { MomentFactory } from 'shared/momentFactory'

export class CourtDecisionHelper {
  static createCourtDecision (claim: Claim, draft: Draft<DraftClaimantResponse>): DecisionType {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtCalculatedPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)

    const defendantEnteredPayBySetDate: Moment = claimResponse.paymentIntention.paymentDate
    const defendantInstalmentLastDate: Moment = PaymentPlanHelper.createPaymentPlanFromClaim(claim).calculateLastPaymentDate()
    const defendantLastPaymentDate: Moment = defendantEnteredPayBySetDate ? defendantEnteredPayBySetDate : defendantInstalmentLastDate

    const claimantLastPaymentDate: Moment = getClaimantLastPaymentDate(draft)

    let courtOfferedLastDate: Moment
    if (courtCalculatedPaymentPlan) {
      courtOfferedLastDate = courtCalculatedPaymentPlan.calculateLastPaymentDate()
    }

    return CourtDecision.calculateDecision(
      defendantLastPaymentDate,
      claimantLastPaymentDate,
      courtOfferedLastDate
    )
  }
}

function getClaimantLastPaymentDate (draft: Draft<DraftClaimantResponse>): Moment {
  switch (draft.document.alternatePaymentMethod.paymentOption.option) {
    case PaymentType.IMMEDIATELY:
      return MomentFactory.currentDate().add(5,'days')
    case PaymentType.BY_SET_DATE:
      return draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
    case PaymentType.INSTALMENTS:
      return PaymentPlanHelper.createPaymentPlanFromForm(draft.document.alternatePaymentMethod.paymentPlan).calculateLastPaymentDate()
    default:
      throw new Error('Unknown claimant payment option!')
  }
}
