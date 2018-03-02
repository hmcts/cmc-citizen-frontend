export class PaymentDeclaration {

  constructor (public paidDate?: string, public explanation?: string) {}

  deserialize (input: any): PaymentDeclaration {
    if (input) {
      this.paidDate = input.paidDate
      this.explanation = input.explanation
    }
    return this
  }
}
