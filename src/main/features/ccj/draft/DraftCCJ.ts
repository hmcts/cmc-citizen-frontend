import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PayBySetDate } from 'ccj/form/models/payBySetDate'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { Draft } from 'models/draft'

export class DraftCCJ implements Draft {
  defendant: Defendant = new Defendant()
  paymentOption: CCJPaymentOption = new CCJPaymentOption()
  paidAmount?: PaidAmount
  payBySetDate?: PayBySetDate
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
      this.payBySetDate = new PayBySetDate().deserialize(input.payBySetDate)
      this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
    }
    return this
  }
}
