import { Party } from './party'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'claims/models/address'
import { MobilePhone } from 'forms/models/mobilePhone'

export class Company extends Party {
  contactPerson?: string

  constructor (name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: MobilePhone,
              email?: string,
              contactPerson?: string) {
    super(PartyType.COMPANY.value,
          name,
          address,
          correspondenceAddress,
          mobilePhone,
          email)
    this.contactPerson = contactPerson
  }

  deserialize (input: any): Company {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyType.COMPANY.value
    }
    return this
  }
}
