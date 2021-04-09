import { Party } from './party'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'

export class SoleTrader extends Party {
  businessName?: string

  constructor (
              name?: string,
              pcqId?: string,
              address?: Address,
              correspondenceAddress?: Address,
              phone?: string,
              email?: string,
              businessName?: string
  ) {
    super(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, name, pcqId, address, correspondenceAddress, phone, email)
    this.businessName = businessName
  }

  deserialize (input: any): SoleTrader {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.businessName = input.businessName
      this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    }
    return this
  }
}
