import { PartyDetails } from './partyDetails'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { PartyType } from 'common/partyType'
import { IsNotBlank, MaxLength } from '@hmcts/cmc-validators'
import { IsDefined } from '@hmcts/class-validator'
import { NameFormatter } from 'utils/nameFormatter'

export class ValidationErrors {
  static readonly FIRSTNAME_REQUIRED: string = 'Enter first name'
  static readonly LASTNAME_REQUIRED: string = 'Enter last name'
  static errorTooLong (input: string): string {
    return `${input} must be no longer than $constraint1 characters`
  }
}

export class IndividualDetails extends PartyDetails {

  dateOfBirth?: DateOfBirth
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
    this.type = PartyType.INDIVIDUAL.value
  }

  static fromObject (input?: any): IndividualDetails {
    if (input == null) {
      return input
    }
    const deserialized = new IndividualDetails()
    Object.assign(deserialized, PartyDetails.fromObject(input))
    deserialized.type = PartyType.INDIVIDUAL.value
    if (input.dateOfBirth) {
      deserialized.dateOfBirth = DateOfBirth.fromObject(input.dateOfBirth)
    }
    deserialized.title = input.title
    deserialized.firstName = input.firstName
    deserialized.lastName = input.lastName
    if (deserialized.firstName && deserialized.lastName) {
      deserialized.name = NameFormatter.fullName(deserialized.firstName, deserialized.lastName, deserialized.title)
    }
    return deserialized
  }

  deserialize (input?: any): IndividualDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.type = PartyType.INDIVIDUAL.value
      if (input.dateOfBirth) {
        this.dateOfBirth = DateOfBirth.fromObject(input.dateOfBirth)
      }
      this.title = input.title
      if (input.firstName && input.lastName) {
        this.firstName = input.firstName
        this.lastName = input.lastName
        this.name = NameFormatter.fullName(this.firstName, this.lastName, this.title)
      }
    }
    return this
  }

  isCompleted (...groups: string[]): boolean {
    const dobComplete: boolean = groups.indexOf('claimant') !== -1 ? !!this.dateOfBirth && this.dateOfBirth.isCompleted() : true
    return super.isCompleted(...groups) && dobComplete
  }
}
