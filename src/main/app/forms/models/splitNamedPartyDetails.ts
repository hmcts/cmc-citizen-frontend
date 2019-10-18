import { IsDefined, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { PartyDetails } from 'forms/models/partyDetails'
import { NameFormatter } from 'utils/nameFormatter'

export class ValidationErrors {
  static readonly FIRSTNAME_REQUIRED: string = 'Enter first name'
  static readonly LASTNAME_REQUIRED: string = 'Enter last name'
  static errorTooLong (input: string): string {
    return `${input} must be no longer than $constraint1 characters`
  }
}

export class SplitNamedPartyDetails extends PartyDetails {

  @ValidateIf(o => o.title !== undefined, { groups: ['defendant'] })
  @MaxLength(35, { message: ValidationErrors.errorTooLong('Title'), groups: ['defendant'] })
  title?: string

  @IsDefined({ message: ValidationErrors.FIRSTNAME_REQUIRED, groups: ['defendant'] })
  @IsNotBlank({ message: ValidationErrors.FIRSTNAME_REQUIRED, groups: ['defendant'] })
  @MaxLength(255, { message: ValidationErrors.errorTooLong('First name'), groups: ['defendant'] })
  firstName?: string

  @IsDefined({ message: ValidationErrors.LASTNAME_REQUIRED, groups: ['defendant'] })
  @IsNotBlank({ message: ValidationErrors.LASTNAME_REQUIRED, groups: ['defendant'] })
  @MaxLength(255, { message: ValidationErrors.errorTooLong('Last name'), groups: ['defendant'] })
  lastName?: string

  constructor () {
    super()
  }

  static fromObject (input?: any): SplitNamedPartyDetails {
    if (input == null) {
      return input
    }
    let deserialized = new SplitNamedPartyDetails()
    Object.assign(deserialized, PartyDetails.fromObject(input))
    if (input.title) {
      deserialized.title = input.title
    }
    deserialized.firstName = input.firstName
    deserialized.lastName = input.lastName
    if (deserialized.firstName && deserialized.lastName) {
      deserialized.name = NameFormatter.fullName(input.firstName, input.lastName, input.title)
    } else {
      deserialized.name = input.name
    }
    return deserialized
  }

  deserialize (input?: any): SplitNamedPartyDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.title = input.title
      if (input.firstName && input.lastName) {
        this.firstName = input.firstName
        this.lastName = input.lastName
        this.name = NameFormatter.fullName(input.firstName, input.lastName, input.title)
      }
    }
    return this
  }
}
