import { DraftCCJ } from 'ccj/draft/DraftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import {
  CountyCourtJudgmentImmediatePayment,
  CountyCourtJudgmentPaidByInstalments,
  CountyCourtJudgmentPaidFullBySetDate
} from 'claims/models/countyCourtJudgment'
import { convertDefendantDetails } from 'claims/converters/defendantDetails'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { PartyDetails } from 'forms/models/partyDetails'

function convertRepaymentPlan (repaymentPlan: RepaymentPlanForm): RepaymentPlan {

  if (repaymentPlan && repaymentPlan.remainingAmount !== undefined) {
    return new RepaymentPlan(
      repaymentPlan.remainingAmount,
      repaymentPlan.firstPayment,
      repaymentPlan.installmentAmount,
      repaymentPlan.firstPaymentDate.asString(),
      repaymentPlan.paymentSchedule.value
    )
  }

  return undefined
}

function convertPaidAmount (draftCcj: DraftCCJ): number {
  return (draftCcj.paidAmount.option.value === PaidAmountOption.YES.value) ? draftCcj.paidAmount.amount : undefined
}

function convertPayBySetDate (draftCcj: DraftCCJ): string {
  return (draftCcj.paymentOption.option === PaymentType.FULL_BY_SPECIFIED_DATE) ? draftCcj.payBySetDate.date.asString() : undefined
}

export class CCJModelConverter {

  static convert (draftCcj: DraftCCJ): object {

    const email: string = draftCcj.defendant.email.address
    const defendant: PartyDetails = draftCcj.defendant.partyDetails
    const paidAmount: number = convertPaidAmount(draftCcj)
    let result

    switch (draftCcj.paymentOption.option) {
      case PaymentType.IMMEDIATELY:
        result = new CountyCourtJudgmentImmediatePayment(convertDefendantDetails(defendant, email), paidAmount)
        break

      case PaymentType.INSTALMENTS:
        result = new CountyCourtJudgmentPaidByInstalments(
          convertDefendantDetails(defendant, email), paidAmount, convertRepaymentPlan(draftCcj.repaymentPlan)
        )
        break

      case PaymentType.FULL_BY_SPECIFIED_DATE:
        result = new CountyCourtJudgmentPaidFullBySetDate(
          convertDefendantDetails(defendant, email), paidAmount, convertPayBySetDate(draftCcj)
        )
        break
    }

    return result
  }
}
