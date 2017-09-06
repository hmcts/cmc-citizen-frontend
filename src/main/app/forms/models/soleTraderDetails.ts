import { MaxLength } from 'class-validator'
import { PartyDetails } from './partyDetails'
import DateOfBirth from 'forms/models/dateOfBirth'
import { PartyType } from 'app/common/partyType'

export class ValidationErrors {
  static readonly ORGANISATION_NAME_TOO_LONG: string = 'Enter organization name no longer than $constraint1 characters'
}

export class SoleTraderDetails extends PartyDetails {

  @MaxLength(35, { message: ValidationErrors.ORGANISATION_NAME_TOO_LONG })
  businessName?: string

  dateOfBirth?: DateOfBirth
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
    if (input.dateOfBirth) {
      deserialized.dateOfBirth = DateOfBirth.fromObject(input.dateOfBirth)
    }
    return deserialized
  }

  deserialize (input?: any): SoleTraderDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.businessName = input.businessName
      this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
      if (input.dateOfBirth) {
        this.dateOfBirth = DateOfBirth.fromObject(input.dateOfBirth)
      }
    }
    return this
  }

  isCompleted (isClaimant?: boolean): boolean {
    const dobCompleted: boolean = isClaimant ? !!this.dateOfBirth && this.dateOfBirth.isCompleted() : true
    return super.isCompleted() && !!this.name && this.name.length > 0 && dobCompleted
  }
}
