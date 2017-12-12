
import { Offer } from 'claims/models/offer'

export class PartyStatement {
  type: string
  madeBy: string
  offer?: Offer

  constructor (type: string, madeBy: string, offer?: Offer) {
    this.type = type
    this.madeBy = madeBy
    this.offer = offer
  }

  deserialize (input: any): PartyStatement {
    if (input) {
      this.type = input.type
      this.madeBy = input.madeBy
      if (input.offer) {
        this.offer = new Offer().deserialize(input.offer)
      }
    }
    return this
  }
}
