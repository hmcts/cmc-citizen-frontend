import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'

export class DraftCCJ {
  defendant: Defendant = new Defendant()
  paymentOption: CCJPaymentOption = new CCJPaymentOption()
  paidAmount?: PaidAmount
  repaymentPlan?: RepaymentPlan

  constructor (defendant: Defendant = new Defendant(), paymentOption: CCJPaymentOption = new CCJPaymentOption(), paidAmount?: PaidAmount, repaymentPlan?: RepaymentPlan) {
    this.defendant = defendant
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
    this.repaymentPlan = repaymentPlan
  }

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
    }
    return this
  }
}
