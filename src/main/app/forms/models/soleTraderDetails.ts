import { MaxLength } from '@hmcts/class-validator'
import { PartyType } from 'common/partyType'
import { SplitNamedPartyDetails } from 'forms/models/splitNamedPartyDetails'

export class ValidationErrors {
  static readonly ORGANISATION_NAME_TOO_LONG: string = 'Enter trading as name no longer than $constraint1 characters'
}

export class SoleTraderDetails extends SplitNamedPartyDetails {

  @MaxLength(35, { message: ValidationErrors.ORGANISATION_NAME_TOO_LONG, groups: ['claimant', 'defendant'] })
  businessName?: string

  constructor () {
    super()
    this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
  }

  static fromObject (input?: any): SoleTraderDetails {
    if (input == null) {
      return input
    }
    let deserialized = new SoleTraderDetails()
    Object.assign(deserialized, SplitNamedPartyDetails.fromObject(input))
    deserialized.businessName = input.businessName
    deserialized.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    return deserialized
  }

  deserialize (input?: any): SoleTraderDetails {
    if (input) {
      Object.assign(this, new SplitNamedPartyDetails().deserialize(input))
      this.businessName = input.businessName
      this.type = PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value
    }
    return this
  }
}
