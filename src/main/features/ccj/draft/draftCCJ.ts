import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PayBySetDate } from 'ccj/form/models/payBySetDate'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'

export class DraftCCJ {
  defendant: Defendant = new Defendant()
  paymentOption: CCJPaymentOption = new CCJPaymentOption()
  paidAmount?: PaidAmount
  payBySetDate?: PayBySetDate
  repaymentPlan?: RepaymentPlan
  qualifiedDeclaration?: QualifiedDeclaration

  constructor (defendant: Defendant = new Defendant(),
               paymentOption: CCJPaymentOption = new CCJPaymentOption(),
               paidAmount?: PaidAmount,
               repaymentPlan?: RepaymentPlan,
               qualifiedDeclaration?: QualifiedDeclaration) {
    this.defendant = defendant
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
    this.repaymentPlan = repaymentPlan
    this.qualifiedDeclaration = qualifiedDeclaration
  }

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.payBySetDate = new PayBySetDate().deserialize(input.payBySetDate)
      this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
      this.qualifiedDeclaration = new QualifiedDeclaration().deserialize(input.qualifiedDeclaration)
    }
    return this
  }
}
