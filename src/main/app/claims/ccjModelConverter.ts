import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Moment } from 'moment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Claim } from 'claims/models/claim'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'

function convertRepaymentPlan (repaymentPlan: RepaymentPlanForm): RepaymentPlan {

  if (repaymentPlan && repaymentPlan.remainingAmount) {
    return new RepaymentPlan(
      repaymentPlan.instalmentAmount,
      repaymentPlan.firstPaymentDate.toMoment(),
      repaymentPlan.paymentSchedule.value
    )
  }

  return undefined
}

function convertPaidAmount (draftCcj: DraftCCJ): number {
  if (draftCcj.paidAmount.option && draftCcj.paidAmount.option.value === PaidAmountOption.YES.value) {
    return draftCcj.paidAmount.amount
  }
  return undefined
}

function convertPayBySetDate (draftCcj: DraftCCJ): Moment {
  return (draftCcj.paymentOption.option === PaymentType.BY_SPECIFIED_DATE)
    ? draftCcj.payBySetDate.date.toMoment() : undefined
}

function getPaymentOption (response: Response, draft: DraftCCJ): PaymentOption {
  if(response.responseType === ResponseType.PART_ADMISSION
    || response.responseType === ResponseType.FULL_ADMISSION) {
      return response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY ?
        response.paymentIntention.paymentOption : draft.paymentOption.option.value as PaymentOption
  }
  return draft.paymentOption.option.value as PaymentOption
}

function getRepaymentPlan (response: Response, draft: DraftCCJ): RepaymentPlan {
  if(response.responseType === ResponseType.PART_ADMISSION
    || response.responseType === ResponseType.FULL_ADMISSION) {
    return response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY ?
      response.paymentIntention.repaymentPlan as RepaymentPlan :  convertRepaymentPlan(draft.repaymentPlan)
  }
  return  convertRepaymentPlan(draft.repaymentPlan)
}

export class CCJModelConverter {

  static convertForRequest (draft: DraftCCJ, claim: Claim): CountyCourtJudgment {
    let statementOfTruth: StatementOfTruth = undefined
    if (draft.qualifiedDeclaration) {
      // API model is called statement of truth
      statementOfTruth = new StatementOfTruth(
        draft.qualifiedDeclaration.signerName,
        draft.qualifiedDeclaration.signerRole
      )
    }

    let ccjType: CountyCourtJudgmentType = undefined

    let paymentOption: PaymentOption = undefined

    let repaymentPlan: RepaymentPlan = undefined

    let response: Response = claim.response

    if(response){
      ccjType = CountyCourtJudgmentType.ADMISSIONS
      paymentOption = getPaymentOption(response, draft)
      repaymentPlan = getRepaymentPlan(response, draft)
    }else {
      ccjType = CountyCourtJudgmentType.DEFAULT
      paymentOption = draft.paymentOption.option.value as PaymentOption
      repaymentPlan = convertRepaymentPlan(draft.repaymentPlan)
    }

    if(!paymentOption) {
      throw new Error('payment option cannot be undefined')
    }

    return new CountyCourtJudgment(
      draft.defendantDateOfBirth.known ? draft.defendantDateOfBirth.date.toMoment() : undefined,
      paymentOption,
      convertPaidAmount(draft),
      repaymentPlan,
      convertPayBySetDate(draft),
      statementOfTruth,
      ccjType
    )
  }
}
