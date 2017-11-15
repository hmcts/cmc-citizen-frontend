import { Serializable } from 'models/serializable'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'

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
