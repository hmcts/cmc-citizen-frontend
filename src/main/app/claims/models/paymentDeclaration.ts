export class PaymentDeclaration {

  constructor (public paidDate?: string, public explanation?: string) {
    this.paidDate = paidDate
    this.explanation = explanation
  }

  deserialize (input: any): PaymentDeclaration {
    if (input) {
      this.paidDate = input.paidDate
      this.explanation = input.explanation
    }
    return this
  }
}
