import Payment from 'app/pay/payment'
import { Person } from 'claims/models/person'

export class Claimant extends Person {
  payment: Payment = new Payment()

  deserialize (input: any): Claimant {
    if (input) {
      Object.assign(this, new Person().deserialize(input))
      this.payment = new Payment().deserialize(input.payment)
    }
    return this
  }
}
