import { PartyType } from 'common/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { Individual as DefendantAsIndividual } from 'claims/models/details/theirs/individual'
import { Company as DefendantAsCompany } from 'claims/models/details/theirs/company'
import { SoleTrader as DefendantAsSoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Organisation as DefendantAsOrganisation } from 'claims/models/details/theirs/organisation'
import { convertAddress } from 'claims/converters/address'

export function convertDefendantDetails (defendant: PartyDetails, email: string): TheirDetails {

  switch (defendant.type) {
    case PartyType.INDIVIDUAL.value:
      const individualDetails = defendant as IndividualDetails
      const result = new DefendantAsIndividual(individualDetails.title, individualDetails.firstName, individualDetails.lastName, convertAddress(individualDetails.address), email)
      result.dateOfBirth = individualDetails.dateOfBirth.known ? individualDetails.dateOfBirth.date.asString() : undefined
      return result

    case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
      const soleTraderDetails: SoleTraderDetails = defendant as SoleTraderDetails

      return new DefendantAsSoleTrader(
        soleTraderDetails.title, soleTraderDetails.firstName, soleTraderDetails.lastName, convertAddress(soleTraderDetails.address), email, soleTraderDetails.businessName
      )

    case PartyType.COMPANY.value:
      const companyDetails = defendant as CompanyDetails

      return new DefendantAsCompany(
        companyDetails.name, convertAddress(companyDetails.address), email, companyDetails.contactPerson
      )

    case PartyType.ORGANISATION.value:
      const organisationDetails = defendant as OrganisationDetails

      return new DefendantAsOrganisation(
        organisationDetails.name, convertAddress(organisationDetails.address), email, organisationDetails.contactPerson
      )
    default:
      throw Error(`Unknown defendant type ${defendant.type}`)
  }
}
