import { TheirDetails } from './theirDetails'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'
import { NameFormatter } from 'utils/nameFormatter'

export class SoleTrader extends TheirDetails {
  businessName?: string
  title?: string
  firstName?: string
  lastName?: string

  constructor (title?: string, firstName?: string, lastName?: string, address?: Address, email?: string, businessName?: string) {
    super(PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, NameFormatter.fullName(firstName, lastName, title), address, email)
    this.businessName = businessName
    this.title = title
    this.firstName = firstName
    this.lastName = lastName
  }

  deserialize (input: any): SoleTrader {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.businessName = input.businessName
      this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
      this.title = input.title
      if (input.firstName && input.lastName) {
        this.firstName = input.firstName
        this.lastName = input.lastName
        this.name = NameFormatter.fullName(input.firstName, input.lastName, input.title)
      }
    }
    return this
  }
}
