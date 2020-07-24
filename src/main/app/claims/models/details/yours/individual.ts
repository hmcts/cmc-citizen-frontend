import { Party } from './party'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'

export class Individual extends Party {
  dateOfBirth: string

  constructor (
    name?: string,
    pcqId?: string,
    address?: Address,
    correspondenceAddress?: Address,
    phone?: string,
    email?: string,
    dateOfBirth?: string
  ) {
    super(PartyType.INDIVIDUAL.value, name, pcqId, address, correspondenceAddress, phone, email)
    this.dateOfBirth = dateOfBirth
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.dateOfBirth = input.dateOfBirth
      this.type = PartyType.INDIVIDUAL.value
      if (input.title) {
        this.title = input.title
      }
      if (input.firstName) {
        this.firstName = input.firstName
      }
      if (input.lastName) {
        this.lastName = input.lastName
      }
      return this
    }
  }
}
