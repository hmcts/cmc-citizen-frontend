export default class PaymentRequest {
  // tslint:disable-next-line variable-name allow snake_case
  constructor (public amount: number, public reference: string, public description: string, public return_url: string) {
    this.amount = amount
    this.reference = reference
    this.description = description
    this.return_url = return_url
  }
}
