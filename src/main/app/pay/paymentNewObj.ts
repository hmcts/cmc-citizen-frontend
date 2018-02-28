import { Fees } from 'app/pay/fees'
import { Links } from 'app/pay/newPaymentResponse'

export class PaymentNewObj {
  id: string
  amount: number
  reference: string
  description: string
  date_created: number // tslint:disable-line variable-name allow snake_case
  fees: Fees
  _links: Links

  static fromObject (input?: any): PaymentNewObj {
    return new PaymentNewObj().deserialize(input)
  }

  deserialize (input?: any): PaymentNewObj {
    if (input) {
      this.id = input.id
      this.amount = input.amount
      this.reference = input.reference
      this.description = input.description
      this.date_created = input.date_created
      this.fees = input.fees
      this._links = input._links
    }
    return this
  }
}
