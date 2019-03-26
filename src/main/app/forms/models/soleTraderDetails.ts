import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { PartyDetails } from './partyDetails'
import { PartyType } from 'common/partyType'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { NameFormatter } from 'utils/nameFormatter'

export class ValidationErrors {
  static readonly ORGANISATION_NAME_TOO_LONG: string = 'Enter trading as name no longer than $constraint1 characters'
  static readonly FIRSTNAME_REQUIRED: string = 'Enter first name'
  static readonly LASTNAME_REQUIRED: string = 'Enter last name'
  static errorTooLong (input: string): string {
    return `${input} must be no longer than $constraint1 characters`
  }
}

export class SoleTraderDetails extends PartyDetails {

  @MaxLength(35, { message: ValidationErrors.ORGANISATION_NAME_TOO_LONG, groups: ['claimant', 'defendant'] })
  businessName?: string

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
    this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
  }

  static fromObject (input?: any): SoleTraderDetails {
    if (input == null) {
      return input
    }
    let deserialized = new SoleTraderDetails()
    Object.assign(deserialized, PartyDetails.fromObject(input))
    if (input.name) {
      deserialized.name = input.name
    }
    deserialized.businessName = input.businessName
    deserialized.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    deserialized.title = input.title
    deserialized.firstName = input.firstName
    deserialized.lastName = input.lastName
    if (deserialized.firstName && deserialized.lastName) {
      deserialized.name = NameFormatter.fullName(deserialized.firstName, deserialized.lastName, deserialized.title)
    }
    return deserialized
  }

  deserialize (input?: any): SoleTraderDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.businessName = input.businessName
      this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
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
