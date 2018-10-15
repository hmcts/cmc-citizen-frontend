import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse.ts'
import { ResponseRejection } from 'claims/models/response/core/responseRejection.ts'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { CourtDetermination } from 'claims/models/response/core/courtDetermination.ts'
import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { ResponseAcceptance } from 'claims/models/response/core/responseAcceptance'
import { YesNoOption } from 'models/yesNoOption'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { PaymentIntention as PaymentIntentionDraft } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { PaymentOption as PaymentOptionDraft, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { DecisionType } from 'common/court-calculations/courtDetermination'

export class ClaimantResponseConverter {

  public static covertToClaimantResponse (draftClaimantResponse: DraftClaimantResponse): ClaimantResponse {
    if (draftClaimantResponse.settleAdmitted && draftClaimantResponse.settleAdmitted.admitted === YesNoOption.NO) {
      let reject: ResponseRejection = new ResponseRejection()
      if (draftClaimantResponse.paidAmount) {
        reject.amountPaid = draftClaimantResponse.paidAmount.amount
      }
      if (draftClaimantResponse.freeMediation) {
        reject.freeMediation = draftClaimantResponse.freeMediation.option === FreeMediationOption.YES
      }
      if (draftClaimantResponse.rejectionReason) {
        reject.reason = draftClaimantResponse.rejectionReason.text
      }
      return reject
    } else return this.createResponseAcceptance(draftClaimantResponse)
  }

  private static createResponseAcceptance (draftClaimantResponse: DraftClaimantResponse): ResponseAcceptance {
    const respAcceptance: ResponseAcceptance = new ResponseAcceptance()
    if (draftClaimantResponse.paidAmount) {
      respAcceptance.amountPaid = draftClaimantResponse.paidAmount.amount
    }
    respAcceptance.formaliseOption = this.getFormaliseOption(draftClaimantResponse.formaliseRepaymentPlan)
    respAcceptance.decisionType = draftClaimantResponse.courtDecisionType
    if (draftClaimantResponse.settleAdmitted
      && draftClaimantResponse.settleAdmitted.admitted === YesNoOption.YES
      && draftClaimantResponse.acceptPaymentMethod.accept === YesNoOption.YES) {
      return respAcceptance
    }
    respAcceptance.claimantPaymentIntention = this.convertPaymentIntention(draftClaimantResponse.alternatePaymentMethod,draftClaimantResponse.courtDecisionType)
    respAcceptance.courtDetermination = this.createCourtDetermination(draftClaimantResponse)
    return respAcceptance
  }

  private static createCourtDetermination (draftClaimantResponse: DraftClaimantResponse): CourtDetermination {
    if (draftClaimantResponse.courtDecisionType === DecisionType.COURT && !draftClaimantResponse.courtOfferedPaymentIntention) {
      throw new Error('court payment intention not found where decision type is COURT')
    }
    const courtDetermination: CourtDetermination = new CourtDetermination()
    courtDetermination.courtDecision = draftClaimantResponse.courtOfferedPaymentIntention
    courtDetermination.courtDecision.repaymentPlan.instalmentAmount = Number(courtDetermination.courtDecision.repaymentPlan.instalmentAmount.toFixed(2))
    if (draftClaimantResponse.rejectionReason) {
      courtDetermination.rejectionReason = draftClaimantResponse.rejectionReason.text
    }
    courtDetermination.disposableIncome = draftClaimantResponse.disposableIncome ? draftClaimantResponse.disposableIncome : 0
    return courtDetermination
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

  private static convertPaymentIntention (draftPaymentIntention: PaymentIntentionDraft, decisionType: DecisionType): PaymentIntention {
    if (draftPaymentIntention) {
      const paymentIntention: PaymentIntention = new PaymentIntention()
      paymentIntention.paymentOption = draftPaymentIntention.paymentOption.option.value as PaymentOption
      if (draftPaymentIntention.paymentDate) {
        paymentIntention.paymentDate = this.convertPaymentDate(draftPaymentIntention.paymentOption, draftPaymentIntention.paymentDate)
      }
      if (draftPaymentIntention.paymentPlan) {
        const repaymentPlan: RepaymentPlan = {
          firstPaymentDate: draftPaymentIntention.paymentPlan.firstPaymentDate.toMoment(),
          instalmentAmount: draftPaymentIntention.paymentPlan.instalmentAmount,
          paymentSchedule: draftPaymentIntention.paymentPlan.paymentSchedule.value as PaymentSchedule
        } as RepaymentPlan
        paymentIntention.repaymentPlan = repaymentPlan
      }
      return paymentIntention
    } else {
      if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
        throw new Error(`claimant payment intention not found where decision type is ${decisionType}`)
      } else {
        return undefined
      }
    }
  }

  private static convertPaymentDate (paymentOption: PaymentOptionDraft, paymentDate: PaymentDate): Moment {
    switch (paymentOption.option) {
      case PaymentType.IMMEDIATELY:
        return MomentFactory.currentDate().add(5, 'days')
      case PaymentType.BY_SET_DATE:
        return paymentDate.date.toMoment()
      default:
        throw new Error(`Unknown value in paymentOption ${paymentOption.option.value}`)
    }
  }

}
