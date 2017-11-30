import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'
import { PaymentDateChecker } from 'response/helpers/paymentDateChecker'

export class PayBySetDate {
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

  hasExplanation (): boolean {
    return !!(this.explanation && this.explanation.text && this.explanation.text.trim())
  }

  requiresExplanation (): boolean {
    try {
      return this.paymentDate !== undefined
        && this.paymentDate.date !== undefined
        && PaymentDateChecker.isLaterThan28DaysFromNow(this.paymentDate.date.toMoment())
    } catch (error) {
      return false
    }
  }
}
