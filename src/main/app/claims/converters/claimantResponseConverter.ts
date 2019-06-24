import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse.ts'
import { ResponseRejection } from 'claims/models/response/core/responseRejection.ts'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { ResponseAcceptance } from 'claims/models/response/core/responseAcceptance'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { CourtDetermination as DomainCourtDetermination } from 'claims/models/response/core/courtDetermination'
import { PaymentIntention as DomainPaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { FreeMediationUtil } from 'shared/utils/freeMediationUtil'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'

export class ClaimantResponseConverter {

  public static convertToClaimantResponse (
    draftClaimantResponse: DraftClaimantResponse,
    isDefendantBusiness: boolean,
    directionsQuestionnaireDraft?: DirectionsQuestionnaireDraft
  ): ClaimantResponse {
    if (!this.isResponseAcceptance(draftClaimantResponse)) {
      let reject: ResponseRejection = new ResponseRejection()

      if (draftClaimantResponse.paidAmount) {
        reject.amountPaid = draftClaimantResponse.paidAmount.amount
      }

      reject.freeMediation = FreeMediationUtil.convertFreeMediation(draftClaimantResponse.freeMediation)

      if (draftClaimantResponse.courtDetermination && draftClaimantResponse.courtDetermination.rejectionReason) {
        reject.reason = draftClaimantResponse.courtDetermination.rejectionReason.text
      }

      this.addStatesPaidOptions(draftClaimantResponse, reject)

      return reject
    } else return this.createResponseAcceptance(draftClaimantResponse, isDefendantBusiness, directionsQuestionnaireDraft)
  }

  private static isResponseAcceptance (draftClaimantResponse: DraftClaimantResponse): boolean {
    if (draftClaimantResponse.settleAdmitted && draftClaimantResponse.settleAdmitted.admitted.option === YesNoOption.NO) {
      return false
    } else if (draftClaimantResponse.accepted && draftClaimantResponse.accepted.accepted.option === YesNoOption.NO) {
      return false
    } else if (draftClaimantResponse.partPaymentReceived && draftClaimantResponse.partPaymentReceived.received.option === YesNoOption.NO) {
      return false
    }

    return true

  }

  private static createResponseAcceptance (
    draftClaimantResponse: DraftClaimantResponse,
    isDefendentBusiness: boolean,
    directionsQuestionnaireDraft: DirectionsQuestionnaireDraft
  ): ResponseAcceptance {
    const respAcceptance: ResponseAcceptance = new ResponseAcceptance()
    if (draftClaimantResponse.paidAmount) {
      respAcceptance.amountPaid = draftClaimantResponse.paidAmount.amount
    }
    if (isDefendentBusiness && draftClaimantResponse.alternatePaymentMethod) {
      respAcceptance.formaliseOption = 'REFER_TO_JUDGE'
    }
    if (draftClaimantResponse.formaliseRepaymentPlan) {
      respAcceptance.formaliseOption = this.getFormaliseOption(draftClaimantResponse.formaliseRepaymentPlan)
    }
    if (draftClaimantResponse.courtDetermination && draftClaimantResponse.courtDetermination.courtDecision) {
      respAcceptance.courtDetermination = this.getCourtDetermination(draftClaimantResponse)
    }
    if (draftClaimantResponse.alternatePaymentMethod) {
      respAcceptance.claimantPaymentIntention = this.getClaimantPaymentIntention(draftClaimantResponse)
    }

    this.addStatesPaidOptions(draftClaimantResponse, respAcceptance)

    if (directionsQuestionnaireDraft !== undefined) {
      this.addDirectionsQuestionnaire(directionsQuestionnaireDraft, respAcceptance)
    }

    return respAcceptance
  }

  private static getCourtDetermination (draftClaimantResponse: DraftClaimantResponse): DomainCourtDetermination {
    const courtDetermination: CourtDetermination = draftClaimantResponse.courtDetermination
    if (!courtDetermination.courtPaymentIntention && !courtDetermination.courtDecision) {
      throw new Error('Court payment intention and court decision are missing in court Determination')
    }

    const responseCourtDetermination: DomainCourtDetermination = new DomainCourtDetermination()
    responseCourtDetermination.courtDecision = courtDetermination.courtDecision
    responseCourtDetermination.courtPaymentIntention = courtDetermination.courtPaymentIntention
    if (draftClaimantResponse.rejectionReason) {
      responseCourtDetermination.rejectionReason = draftClaimantResponse.rejectionReason.text
    }
    responseCourtDetermination.disposableIncome = courtDetermination.disposableIncome ? courtDetermination.disposableIncome : 0
    responseCourtDetermination.decisionType = courtDetermination.decisionType
    return responseCourtDetermination
  }

  private static getClaimantPaymentIntention (draftClaimantResponse: DraftClaimantResponse): DomainPaymentIntention {
    const claimantPaymentIntention = draftClaimantResponse.alternatePaymentMethod.toDomainInstance()
    if (draftClaimantResponse.alternatePaymentMethod.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
      claimantPaymentIntention.paymentDate = MomentFactory.currentDate().add(5, 'days')
    }
    return claimantPaymentIntention
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

  private static addStatesPaidOptions (draftClaimantResponse: DraftClaimantResponse,
                                       claimantResponse: ClaimantResponse) {
    if (draftClaimantResponse.partPaymentReceived) {
      claimantResponse.paymentReceived = draftClaimantResponse.partPaymentReceived.received.option as YesNoOption
    }

    if (draftClaimantResponse.accepted) {
      claimantResponse.settleForAmount = draftClaimantResponse.accepted.accepted.option as YesNoOption
    }

  }

  private static addDirectionsQuestionnaire (directionsQuestionnaireDraft: DirectionsQuestionnaireDraft,
                                             respAcceptance: ResponseAcceptance) {
    respAcceptance.directionsQuestionnaire = DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraft)

  }
}
