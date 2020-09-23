import { PartyDetails } from './partyDetails'
import { PartyType } from 'common/partyType'
import { MaxLength } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly CONTACT_PERSON_NAME_TOO_LONG: string = 'Contact Person name must be no longer than $constraint1 characters'
}

export class ValidationConstraints {
  static readonly CONTACT_PERSON_MAX_LENGTH: number = 30
}

export class OrganisationDetails extends PartyDetails {

  @MaxLength(
    ValidationConstraints.CONTACT_PERSON_MAX_LENGTH,
    { message: ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG, groups: ['claimant', 'defendant', 'response'] }
  )
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
