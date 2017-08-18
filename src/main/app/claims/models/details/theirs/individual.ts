import { TheirDetails } from './theirDetails'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'claims/models/address'
import Email from 'forms/models/email'

export class Individual extends TheirDetails {
  constructor (name?: string,
              address?: Address,
              email?: Email) {
    super(PartyType.INDIVIDUAL.value,
          name,
          address,
          email)
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.type = PartyType.INDIVIDUAL.value
    }
    return this
  }
}
