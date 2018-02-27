import { LocalDate } from 'forms/models/localDate'

export class WhenDidYouPay {
  paidDate: LocalDate
  explanation: string

  constructor (paidDate: LocalDate, explanation: string) {
    this.paidDate = paidDate
    this.explanation = explanation
  }

  static fromObject (value?: any): WhenDidYouPay {
    if (!value) {
      return value
    }

    const paidDate = LocalDate.fromObject(value.paidDate)
    const explanation = value.explanation
    return new WhenDidYouPay(paidDate, explanation)
  }

  deserialize (input: any): WhenDidYouPay {
    if (input) {
      this.paidDate = LocalDate.fromObject(input.paidDate)
      this.explanation = input.explanation
    }
    return this
  }
}
