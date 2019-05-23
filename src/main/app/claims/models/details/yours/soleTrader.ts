import { Party } from './party'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'
import { NameFormatter } from 'utils/nameFormatter'

export class SoleTrader extends Party {
  businessName?: string

  constructor (
              title?: string,
              firstName?: string,
              lastName?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: string,
              email?: string,
              businessName?: string) {
    super(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, NameFormatter.fullName(firstName, lastName, title), address, correspondenceAddress, mobilePhone, email)
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
