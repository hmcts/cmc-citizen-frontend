export class PaymentDeclaration {

  constructor (public paidDate?: string, public paidAmount?: number, public explanation?: string) {}

  deserialize (input: any): PaymentDeclaration {
    if (input) {
      this.paidDate = input.paidDate
      this.paidAmount = input.paidAmount
      this.explanation = input.explanation
    }
    return this
  }
}
