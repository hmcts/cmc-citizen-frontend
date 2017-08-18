import TheirDetails from './theirDetails'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'forms/models/address'

export default class SoleTrader extends TheirDetails {
  businessName?: string

  constructor (name?: string,
              address?: Address,
              email?: string,
              businessName?: string) {
    super(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
          name,
          address,
          email)
    this.businessName = businessName
  }

  deserialize (input: any): SoleTrader {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.businessName = input.businessName
      this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    }
    return this
  }
}
