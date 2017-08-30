import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentType'
import { PaidAmount } from 'ccj/form/models/paidAmount'

export class DraftCCJ {
  defendant: Defendant = new Defendant()
  paymentOption: CCJPaymentOption = new CCJPaymentOption()
  paidAmount?: PaidAmount

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
    }
    return this
  }
}
