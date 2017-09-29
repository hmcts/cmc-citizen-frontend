import { DraftCCJ } from 'ccj/draft/DraftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { convertDefendantDetails } from 'claims/converters/defendantDetails'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Moment } from 'moment'

function convertRepaymentPlan (repaymentPlan: RepaymentPlanForm): RepaymentPlan {

  if (repaymentPlan && repaymentPlan.remainingAmount) {
    return new RepaymentPlan(
      repaymentPlan.remainingAmount,
      repaymentPlan.firstPayment,
      repaymentPlan.installmentAmount,
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
  return (draftCcj.paymentOption.option === PaymentType.FULL_BY_SPECIFIED_DATE)
    ? draftCcj.payBySetDate.date.toMoment() : undefined
}

export class CCJModelConverter {

  static convert (draftCcj: DraftCCJ): CountyCourtJudgment {

    return new CountyCourtJudgment(
      convertDefendantDetails(draftCcj.defendant.partyDetails, draftCcj.defendant.email.address),
      draftCcj.paymentOption.option.value,
      convertPaidAmount(draftCcj),
      convertRepaymentPlan(draftCcj.repaymentPlan),
      convertPayBySetDate(draftCcj)
    )
  }
}
