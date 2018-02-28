export class WhenDidYouPay {
  paidDate: string
  explanation: string

  constructor (paidDate: string, explanation: string) {
    this.paidDate = paidDate
    this.explanation = explanation
  }

  deserialize (input: any): WhenDidYouPay {
    if (input) {
      this.paidDate = input.paidDate
      this.explanation = input.explanation
    }
    return this
  }
}
