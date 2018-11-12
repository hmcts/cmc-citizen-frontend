import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse.ts'
import { ResponseRejection } from 'claims/models/response/core/responseRejection.ts'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { ResponseAcceptance } from 'claims/models/response/core/responseAcceptance'
import { YesNoOption } from 'models/yesNoOption'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { CourtDetermination as DomainCourtDetermination } from 'claims/models/response/core/courtDetermination'
import { PaymentIntention as DomainPaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { DecisionType } from 'claimant-response/draft/courtDecision'

export class ClaimantResponseConverter {

  public static convertToClaimantResponse (draftClaimantResponse: DraftClaimantResponse): ClaimantResponse {
    if (draftClaimantResponse.settleAdmitted && draftClaimantResponse.settleAdmitted.admitted === YesNoOption.NO) {
      let reject: ResponseRejection = new ResponseRejection()
      if (draftClaimantResponse.paidAmount) {
        reject.amountPaid = draftClaimantResponse.paidAmount.amount
      }
      if (draftClaimantResponse.freeMediation) {
        reject.freeMediation = draftClaimantResponse.freeMediation.option === FreeMediationOption.YES
      }
      if (draftClaimantResponse.courtDetermination && draftClaimantResponse.courtDetermination.rejectionReason) {
        reject.reason = draftClaimantResponse.courtDetermination.rejectionReason.text
      }
      return reject
    } else return this.createResponseAcceptance(draftClaimantResponse)
  }

  private static createResponseAcceptance (draftClaimantResponse: DraftClaimantResponse): ResponseAcceptance {
    const respAcceptance: ResponseAcceptance = new ResponseAcceptance()
    if (draftClaimantResponse.paidAmount) {
      respAcceptance.amountPaid = draftClaimantResponse.paidAmount.amount
    }
    if (draftClaimantResponse.formaliseRepaymentPlan) {
      respAcceptance.formaliseOption = this.getFormaliseOption(draftClaimantResponse.formaliseRepaymentPlan)
    }
    const courtDetermination: DomainCourtDetermination = this.getCourtDetermination(draftClaimantResponse.courtDetermination)
    if (courtDetermination) {
      respAcceptance.courtDetermination = courtDetermination
    }
    const claimantPaymentIntention: DomainPaymentIntention = this.getClaimantPaymentIntention(draftClaimantResponse)
    if (claimantPaymentIntention) {
      respAcceptance.claimantPaymentIntention = claimantPaymentIntention
    }
    return respAcceptance
  }

  private static getCourtDetermination (courtDetermination: CourtDetermination): DomainCourtDetermination {
    const decisionType: DecisionType = courtDetermination.decisionType
    if (decisionType === DecisionType.COURT && !courtDetermination.courtPaymentIntention) {
      throw new Error('court offered payment intention not found where decision type is COURT')
    }
    if (!courtDetermination.courtPaymentIntention && !courtDetermination.courtDecision) {
      return undefined
    }
    const responseCourtDetermination: DomainCourtDetermination = new DomainCourtDetermination()
    responseCourtDetermination.courtDecision = courtDetermination.courtDecision
    responseCourtDetermination.courtPaymentIntention = courtDetermination.courtPaymentIntention
    if (courtDetermination.rejectionReason) {
      responseCourtDetermination.rejectionReason = courtDetermination.rejectionReason.text
    }
    responseCourtDetermination.disposableIncome = courtDetermination.disposableIncome ? courtDetermination.disposableIncome : 0
    responseCourtDetermination.decisionType = courtDetermination.decisionType
    return responseCourtDetermination
  }

  private static getClaimantPaymentIntention (draftClaimantResponse: DraftClaimantResponse): DomainPaymentIntention {
    const decisionType = draftClaimantResponse.courtDetermination.decisionType
    if (draftClaimantResponse.alternatePaymentMethod) {
      const claimantPaymentIntention = draftClaimantResponse.alternatePaymentMethod.toDomainInstance()
      if (draftClaimantResponse.alternatePaymentMethod.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
        claimantPaymentIntention.paymentDate = MomentFactory.currentDate().add(5, 'days')
      }
      return claimantPaymentIntention
    } else if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      throw new Error(`claimant payment intention not found where decision type is ${decisionType}`)
    }
    return undefined
  }

  private static getFormaliseOption (repaymentPlan: FormaliseRepaymentPlan): string {
    switch (repaymentPlan.option) {
      case FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT :
        return 'SETTLEMENT'
      case FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT :
        return 'CCJ'
      case FormaliseRepaymentPlanOption.REFER_TO_JUDGE :
        return 'REFER_TO_JUDGE'
      default:
        throw new Error(`Unknown formalise repayment option ${repaymentPlan.option.value}`)
    }
  }
}
