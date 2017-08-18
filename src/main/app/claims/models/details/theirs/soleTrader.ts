import { TheirDetails } from './theirDetails'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'claims/models/address'
import Email from 'forms/models/email'

export class SoleTrader extends TheirDetails {
  businessName?: string

  constructor (name?: string,
              address?: Address,
              email?: Email,
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
