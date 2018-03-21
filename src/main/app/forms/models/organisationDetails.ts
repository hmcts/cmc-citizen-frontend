import { MaxLength } from 'class-validator'
import { PartyDetails } from './partyDetails'
import { PartyType } from 'app/common/partyType'

export class ValidationErrors {
  static readonly CONTACT_PERSON_NAME_TOO_LONG: string = 'Contact Person name must be no longer than $constraint1 characters'
}

export class OrganisationDetails extends PartyDetails {

  @MaxLength(35, { message: ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG, groups: ['claimant', 'response'] })
  contactPerson?: string

  constructor () {
    super()
    this.type = PartyType.ORGANISATION.value
  }

  static fromObject (input?: any): OrganisationDetails {
    if (input == null) {
      return input
    }
    let deserialized = new OrganisationDetails()
    Object.assign(deserialized, PartyDetails.fromObject(input))
    deserialized.contactPerson = input.contactPerson
    deserialized.type = PartyType.ORGANISATION.value
    return deserialized
  }

  deserialize (input?: any): OrganisationDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyType.ORGANISATION.value
    }
    return this
  }
}
