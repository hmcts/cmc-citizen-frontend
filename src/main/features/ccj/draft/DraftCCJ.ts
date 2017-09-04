import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PayBySetDate } from 'ccj/form/models/payBySetDate'

export class DraftCCJ {
  defendant: Defendant = new Defendant()
  paymentOption: CCJPaymentOption = new CCJPaymentOption()
  paidAmount?: PaidAmount
  payBySetDate?: PayBySetDate

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
      this.paidAmount = new PaidAmount().deserialize(input.paidAmount)
      this.payBySetDate = new PayBySetDate().deserialize(input.payBySetDate)
    }
    return this
  }
}
