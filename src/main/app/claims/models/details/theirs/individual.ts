import { TheirDetails } from './theirDetails'
import { PartyType } from 'common/partyType'
import { Address } from 'claims/models/address'
import { NameFormatter } from 'utils/nameFormatter'

export class Individual extends TheirDetails {
  dateOfBirth?: string
  title?: string
  firstName?: string
  lastName?: string

  constructor (title?: string, firstName?: string, lastName?: string, address?: Address, email?: string, phone?: string) {
    super(PartyType.INDIVIDUAL.value, NameFormatter.fullName(firstName, lastName, title), address, email, phone)
    this.title = title
    this.firstName = firstName
    this.lastName = lastName
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      if (input.dateOfBirth) {
        this.dateOfBirth = input.dateOfBirth
      }
      this.title = input.title
      if (input.firstName && input.lastName) {
        this.firstName = input.firstName
        this.lastName = input.lastName
        this.name = NameFormatter.fullName(input.firstName, input.lastName, input.title)
      }
      this.type = PartyType.INDIVIDUAL.value
    }
    return this
  }
}
