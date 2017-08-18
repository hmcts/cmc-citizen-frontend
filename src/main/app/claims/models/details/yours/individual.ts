import { Party } from './party'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'
import { PartyType } from 'forms/models/partyType'
import { Address } from 'claims/models/address'
import { MobilePhone } from 'forms/models/mobilePhone'

export class Individual extends Party {
  dateOfBirth: Moment

  constructor (name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: MobilePhone,
              email?: string,
              dateOfBirth?: Moment) {
    super(PartyType.INDIVIDUAL.value,
          name,
          address,
          correspondenceAddress,
          mobilePhone,
          email)
    this.dateOfBirth = dateOfBirth
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.dateOfBirth = MomentFactory.parse(input.dateOfBirth)
      this.type = PartyType.INDIVIDUAL.value
    }
    return this
  }
}
