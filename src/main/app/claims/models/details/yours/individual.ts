import { Party } from './party'
import { PartyType } from 'app/common/partyType'
import { Address } from 'claims/models/address'

export class Individual extends Party {
  dateOfBirth: string

  constructor (
              name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: string,
              email?: string,
              dateOfBirth?: string) {
    super(PartyType.INDIVIDUAL.value, name, address, correspondenceAddress, mobilePhone, email)
    this.dateOfBirth = dateOfBirth
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.dateOfBirth = input.dateOfBirth
      this.type = PartyType.INDIVIDUAL.value
    }
    return this
  }
}
