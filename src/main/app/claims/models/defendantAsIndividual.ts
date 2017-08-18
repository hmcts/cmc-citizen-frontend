import TheirDetails from './theirDetails'
import { Moment } from 'moment'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'forms/models/address'

export default class Individual extends TheirDetails {
  constructor (name?: string,
              address?: Address,
              email?: string,
              dateOfBirth?: Moment) {
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
