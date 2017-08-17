import Party from './party'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'forms/models/address'
import { MobilePhone } from 'forms/models/mobilePhone'

export default class SoleTrader extends Party {
  businessName?: string

  constructor (name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: MobilePhone,
              email?: string,
              businessName?: string) {
    super(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value,
          name,
          address,
          correspondenceAddress,
          mobilePhone,
          email)
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
