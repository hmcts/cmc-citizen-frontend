import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PayBySetDate } from 'ccj/form/models/payBySetDate'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'
import { DraftDocument } from 'models/draftDocument'

export class DraftCCJ extends DraftDocument {
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
    super()
    this.defendant = defendant
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
    this.repaymentPlan = repaymentPlan
    this.qualifiedDeclaration = qualifiedDeclaration
  }

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.externalId = input['externalId']
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.payBySetDate = new PayBySetDate().deserialize(input.payBySetDate)
      this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
      if (input.qualifiedDeclaration) {
        this.qualifiedDeclaration = new QualifiedDeclaration().deserialize(input.qualifiedDeclaration)
      }
    }
    return this
  }
}
