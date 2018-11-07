import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse.ts'
import { ResponseRejection } from 'claims/models/response/core/responseRejection.ts'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { ResponseAcceptance } from 'claims/models/response/core/responseAcceptance'
import { YesNoOption } from 'models/yesNoOption'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { PaymentIntention as ModelPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'

export class ClaimantResponseConverter {

  public static convertToClaimantResponse (draftClaimantResponse: DraftClaimantResponse): ClaimantResponse {
    if (!this.isResponseAcceptance(draftClaimantResponse)) {
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

  private static isResponseAcceptance (draftClaimantResponse: DraftClaimantResponse): boolean {
    if (draftClaimantResponse.settleAdmitted && draftClaimantResponse.settleAdmitted.admitted === YesNoOption.NO) {
      return false
    } else if (draftClaimantResponse.accepted && draftClaimantResponse.accepted.accepted === YesNoOption.NO) {
      return false
    } else if (draftClaimantResponse.partPaymentReceived && draftClaimantResponse.partPaymentReceived.received === YesNoOption.NO) {
      return false
    }

    return true

  }

  private static createResponseAcceptance (draftClaimantResponse: DraftClaimantResponse): ResponseAcceptance {
    const respAcceptance: ResponseAcceptance = new ResponseAcceptance()
    if (draftClaimantResponse.paidAmount) {
      respAcceptance.amountPaid = draftClaimantResponse.paidAmount.amount
    }
    if (draftClaimantResponse.formaliseRepaymentPlan) {
      respAcceptance.formaliseOption = this.getFormaliseOption(draftClaimantResponse.formaliseRepaymentPlan)
    }
    const courtDetermination: CourtDetermination = draftClaimantResponse.courtDetermination
    if (courtDetermination) {
      respAcceptance.courtDetermination = {
        courtDecision: courtDetermination.courtDecision,
        courtPaymentIntention: courtDetermination.courtPaymentIntention,
        rejectionReason: courtDetermination.rejectionReason ?
          courtDetermination.rejectionReason.text : undefined,
        disposableIncome: courtDetermination.disposableIncome ?
          courtDetermination.disposableIncome : 0,
        decisionType: courtDetermination.decisionType
      }
    }
    const claimantPaymentIntention: ModelPaymentIntention = draftClaimantResponse.alternatePaymentMethod
    if (claimantPaymentIntention) {
      respAcceptance.claimantPaymentIntention = claimantPaymentIntention.toDomainInstance()

      if (claimantPaymentIntention.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
        respAcceptance.claimantPaymentIntention.paymentDate = MomentFactory.currentDate().add(5, 'days')
      }
    }
    return respAcceptance
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
