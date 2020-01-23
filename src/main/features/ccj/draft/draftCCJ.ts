import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { QualifiedDeclaration } from 'ccj/form/models/qualifiedDeclaration'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { DateOfBirth } from 'forms/models/dateOfBirth'

export class DraftCCJ extends DraftDocument {
  defendantDateOfBirth?: DateOfBirth
  paymentOption: CCJPaymentOption = new CCJPaymentOption()
  paidAmount?: PaidAmount
  payBySetDate?: PaymentDate
  repaymentPlan?: RepaymentPlan
  qualifiedDeclaration?: QualifiedDeclaration

  constructor (defendantDateOfBirth: DateOfBirth = new DateOfBirth(),
               paymentOption: CCJPaymentOption = new CCJPaymentOption(),
               paidAmount?: PaidAmount,
               repaymentPlan?: RepaymentPlan,
               qualifiedDeclaration?: QualifiedDeclaration) {
    super()
    this.defendantDateOfBirth = defendantDateOfBirth
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
    this.repaymentPlan = repaymentPlan
    this.qualifiedDeclaration = qualifiedDeclaration
  }

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.externalId = input.externalId
      if (input.defendantDateOfBirth) {
        this.defendantDateOfBirth = new DateOfBirth().deserialize(input.defendantDateOfBirth)
      }
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.payBySetDate = new PaymentDate().deserialize(input.payBySetDate)
      this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
      if (input.qualifiedDeclaration) {
        this.qualifiedDeclaration = new QualifiedDeclaration().deserialize(input.qualifiedDeclaration)
      }
    }
    return this
  }
}
