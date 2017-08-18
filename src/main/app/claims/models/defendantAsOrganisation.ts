import TheirDetails from './theirDetails'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'forms/models/address'
import { MobilePhone } from 'forms/models/mobilePhone'

export default class Organisation extends TheirDetails {
  contactPerson?: string

  constructor (name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: MobilePhone,
              email?: string,
              contactPerson?: string) {
    super(PartyType.ORGANISATION.value,
          name,
          address,
          email)
    this.contactPerson = contactPerson
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyType.ORGANISATION.value
    }
    return this
  }
}
