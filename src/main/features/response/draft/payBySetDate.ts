import { Serializable } from 'models/serializable'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'

export class PayBySetDate implements Serializable<PayBySetDate> {
  paymentDate: PaymentDate
  explanation?: Explanation

  constructor (paymentDate?: PaymentDate, explanation?: Explanation) {
    this.paymentDate = paymentDate
    this.explanation = explanation
  }

  deserialize (input: any): PayBySetDate {
    if (input) {
      this.paymentDate = new PaymentDate().deserialize(input.paymentDate)
      this.explanation = new Explanation().deserialize(input.explanation)
    }
    return this
  }

  clearExplanation (): void {
    this.explanation = undefined
  }
}
