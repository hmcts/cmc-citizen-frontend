import { TheirDetails } from './theirDetails'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'

export class Company extends TheirDetails {
  contactPerson?: string

  constructor (name?: string, address?: Address, email?: string, contactPerson?: string, phone?: string) {
    super(PartyType.COMPANY.value, name, address, email, phone)
    this.contactPerson = contactPerson
  }

  deserialize (input: any): Company {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyType.COMPANY.value
    }
    return this
  }
}
