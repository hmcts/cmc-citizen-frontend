import { TheirDetails } from './theirDetails'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'claims/models/address'
import Email from 'forms/models/email'

export class Company extends TheirDetails {
  contactPerson?: string

  constructor (name?: string,
              address?: Address,
              email?: Email,
              contactPerson?: string) {
    super(PartyType.COMPANY.value,
          name,
          address,
          email)
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
