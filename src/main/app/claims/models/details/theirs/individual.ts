import { TheirDetails } from './theirDetails'
import { PartyType } from 'app/common/partyType'
import { Address } from 'claims/models/address'

export class Individual extends TheirDetails {
  constructor (name?: string, address?: Address, email?: string) {
    super(PartyType.INDIVIDUAL.value, name, address, email)
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.type = PartyType.INDIVIDUAL.value
    }
    return this
  }
}
