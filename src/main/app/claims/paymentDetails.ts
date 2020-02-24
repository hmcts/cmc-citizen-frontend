export class PaymentDetails {
  constructor (public nextUrl?: string, public reference?: string, public status?: string, public amount?: number) {
  }

  deserialize (input?: any): PaymentDetails {
    if (input) {
      this.nextUrl = input.nextUrl
      this.reference = input.reference
      this.status = input.status
      this.amount = input.amount
    }
    return this
  }
}
