import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/replaymentPlan'

abstract class CountyCourtJudgment {

  constructor (public defendant: TheirDetails,
               public paymentOption: string,
               public paidAmount: number) {

    this.defendant = defendant
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
  }
}

export class CountyCourtJudgmentImmediatePayment extends CountyCourtJudgment {

  constructor (public defendant: TheirDetails,
               public paidAmount: number) {
    super(defendant, PaymentType.IMMEDIATELY.value, paidAmount)
  }
}

export class CountyCourtJudgmentPaidByInstalments extends CountyCourtJudgment {

  constructor (public defendant: TheirDetails,
               public paidAmount: number,
               public repaymentPlan: RepaymentPlan) {
    super(defendant, PaymentType.INSTALMENTS.value, paidAmount)
    this.repaymentPlan = repaymentPlan
  }
}

export class CountyCourtJudgmentPaidFullBySetDate extends CountyCourtJudgment {

  constructor (public defendant: TheirDetails,
               public paidAmount: number,
               public payBySetDate: string) {
    super(defendant, PaymentType.FULL_BY_SPECIFIED_DATE.value, paidAmount)
    this.payBySetDate = payBySetDate
  }
}
