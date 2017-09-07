import { IsDefined, MaxLength } from 'class-validator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { PartyDetails } from './partyDetails'
import { PartyType } from 'app/common/partyType'

export class ValidationErrors {
  static readonly CONTACT_PERSON_NAME_TOO_LONG: string = 'Contact Person name must be no longer than $constraint1 characters'
  static readonly CONTACT_PERSON_REQUIRED: string = 'Enter contact person name(s)'
}

export class CompanyDetails extends PartyDetails {

  @IsDefined({ message: ValidationErrors.CONTACT_PERSON_REQUIRED, groups: ['claimant'] })
  @IsNotBlank({ message: ValidationErrors.CONTACT_PERSON_REQUIRED, groups: ['claimant'] })
  @MaxLength(35, { message: ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG, groups: ['claimant'] })
  contactPerson?: string

  constructor () {
    super()
    this.type = PartyType.COMPANY.value
  }

  static fromObject (input?: any): CompanyDetails {
    if (input == null) {
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
