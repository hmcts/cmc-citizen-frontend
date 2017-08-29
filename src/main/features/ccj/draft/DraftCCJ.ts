import { Defendant } from 'app/drafts/models/defendant'
import { CCJPaymentOption } from 'ccj/form/models/ccj-payment-type'

export class DraftCCJ {
  defendant: Defendant = new Defendant()
  paymentOption: CCJPaymentOption = new CCJPaymentOption()

  deserialize (input: any): DraftCCJ {
    if (input) {
      this.defendant = new Defendant().deserialize(input.defendant)
      this.paymentOption = new CCJPaymentOption().deserialize(input.paymentOption)
    }
    return this
  }

}
