import { Party } from './party'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'
import { NameFormatter } from 'utils/nameFormatter'

export class Individual extends Party {
  dateOfBirth: string
  title: string
  firstName: string
  lastName: string

  constructor (
              title?: string,
              firstName?: string,
              lastName?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: string,
              email?: string,
              dateOfBirth?: string) {
    super(PartyType.INDIVIDUAL.value, NameFormatter.fullName(firstName, lastName, title), address, correspondenceAddress, mobilePhone, email)
    this.dateOfBirth = dateOfBirth
    this.title = title
    this.firstName = firstName
    this.lastName = lastName

  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.dateOfBirth = input.dateOfBirth
      this.title = input.title
      this.firstName = input.firstName
      this.lastName = input.lastName
      this.type = PartyType.INDIVIDUAL.value
    }
    return this
  }
}
