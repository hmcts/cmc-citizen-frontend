import { PartyType } from 'common/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'

export class PartyDetailsFactory {

  static createInstance (type: string): PartyDetails {
    switch (type) {
      case PartyType.INDIVIDUAL.value:
        return new IndividualDetails()
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        return new SoleTraderDetails()
      case PartyType.COMPANY.value:
        return new CompanyDetails()
      case PartyType.ORGANISATION.value:
        return new OrganisationDetails()
      default:
        throw Error(`Unknown party type: ${type}`)
    }
  }
}
