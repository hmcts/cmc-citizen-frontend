import { PartyDetails } from './partyDetails'
import { PartyType } from 'common/partyType'
import { MaxLength } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly CONTACT_PERSON_NAME_TOO_LONG: string = 'Contact Person name must be no longer than $constraint1 characters'
}

export class ValidationConstraints {
  static readonly CONTACT_PERSON_MAX_LENGTH: number = 30
}

export class CompanyDetails extends PartyDetails {

  @MaxLength(ValidationConstraints.CONTACT_PERSON_MAX_LENGTH, {
    message: ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG,
    groups: ['claimant', 'defendant', 'response']
  })
  contactPerson?: string

  constructor () {
    super()
    this.type = PartyType.COMPANY.value
  }

  static fromObject (input?: any): CompanyDetails {
    if (input === undefined) {
      return input
    }
    let deserialized = new CompanyDetails()
    Object.assign(deserialized, PartyDetails.fromObject(input))
    deserialized.contactPerson = input.contactPerson
    deserialized.type = PartyType.COMPANY.value
    return deserialized
  }

  deserialize (input?: any): CompanyDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyType.COMPANY.value
    }
    return this
  }
}
