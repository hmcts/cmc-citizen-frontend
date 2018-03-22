import { MaxLength } from 'class-validator'
import { PartyDetails } from './partyDetails'
import { PartyType } from 'app/common/partyType'

export class ValidationErrors {
  static readonly CONTACT_PERSON_NAME_TOO_LONG: string = 'Contact Person name must be no longer than $constraint1 characters'
}

export class CompanyDetails extends PartyDetails {

  @MaxLength(35, { message: ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG, groups: ['claimant', 'response'] })
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
