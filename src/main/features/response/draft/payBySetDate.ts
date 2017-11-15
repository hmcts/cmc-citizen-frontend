import { PaymentDate } from 'response/form/models/pay-by-set-date/paymentDate'
import { Serializable } from 'models/serializable'

export class PayBySetDate implements Serializable<PayBySetDate> {
  paymentDate: PaymentDate

  constructor (paymentDate?: PaymentDate) {
    this.paymentDate = paymentDate
  }

  deserialize (input: any): PayBySetDate {
    if (input) {
      this.paymentDate = new PaymentDate().deserialize(input.paymentDate)
    }
    return this
  }
}
