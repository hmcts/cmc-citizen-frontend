import DraftClaim from 'drafts/models/draftClaim'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyType } from 'forms/models/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import ClaimData from 'claims/models/claimData'
import { Party } from 'claims/models/details/yours/party'
import { Individual as ClaimantAsIndividual } from 'claims/models/details/yours/individual'
import { Company as ClaimantAsCompany } from 'claims/models/details/yours/company'
import { SoleTrader as ClaimantAsSoleTrader } from 'claims/models/details/yours/soleTrader'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { Organisation as ClaimantAsOrganisation } from 'claims/models/details/yours/organisation'
import { Individual as DefendantAsIndividual } from 'claims/models/details/theirs/individual'
import { Company as DefendantAsCompany } from 'claims/models/details/theirs/company'
import { SoleTrader as DefendantAsSoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Organisation as DefendantAsOrganisation } from 'claims/models/details/theirs/organisation'
import InterestDate from 'app/claims/models/interestDate'
import { Address } from 'claims/models/address'
import { Address as AddressForm } from 'forms/models/address'

export class ClaimModelConverter {

  static convert (draftClaim: DraftClaim): ClaimData {
    let claimData: ClaimData = new ClaimData()
    if (draftClaim.interestDate.date.asString() === '') {
      // delete claimData.interestDate
    } else {
      claimData.interestDate = new InterestDate()
      claimData.interestDate.date = draftClaim.interestDate.date.asString() as any
    }

    claimData.claimant = this.convertClaimantDetails(draftClaim)
    claimData.defendant = this.convertDefendantDetails(draftClaim)
    claimData.payment = draftClaim.claimant.payment
    claimData.reason = draftClaim.reason.reason as any
    if (!draftClaim.claimant.partyDetails.hasCorrespondenceAddress) {
      delete claimData.claimant.correspondenceAddress
    }
    return claimData
  }

  private static convertClaimantDetails (draftClaim: DraftClaim): Party {
    switch (draftClaim.claimant.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        let individualDetails = draftClaim.claimant.partyDetails as IndividualDetails
        return new ClaimantAsIndividual(individualDetails.name,
                               this.convertAddress(individualDetails.address),
                               this.convertAddress(individualDetails.correspondenceAddress),
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               individualDetails.dateOfBirth.date.toMoment())
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        let soleTraderDetails: SoleTraderDetails = draftClaim.claimant.partyDetails as SoleTraderDetails
        return new ClaimantAsSoleTrader(soleTraderDetails.name,
                               this.convertAddress(soleTraderDetails.address),
                               this.convertAddress(soleTraderDetails.correspondenceAddress),
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               soleTraderDetails.businessName)
      case PartyType.COMPANY.value:
        let companyDetails = draftClaim.claimant.partyDetails as CompanyDetails
        return new ClaimantAsCompany(companyDetails.name,
                               this.convertAddress(companyDetails.address),
                               this.convertAddress(companyDetails.correspondenceAddress),
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               companyDetails.contactPerson)
      case PartyType.ORGANISATION.value:
        let organisationDetails = draftClaim.claimant.partyDetails as OrganisationDetails
        return new ClaimantAsOrganisation(organisationDetails.name,
                               this.convertAddress(organisationDetails.address),
                               this.convertAddress(organisationDetails.correspondenceAddress),
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               organisationDetails.contactPerson)
      default:
        console.log('Something went wrong, No claimant type is set')
        return undefined
    }
  }

  private static convertDefendantDetails (draftClaim: DraftClaim): TheirDetails {
    const defendantDetails: PartyDetails = draftClaim.defendant.partyDetails
    switch (defendantDetails.type) {
      case PartyType.INDIVIDUAL.value:
        let individualDetails = defendantDetails as IndividualDetails
        return new DefendantAsIndividual(individualDetails.name,
                               this.convertAddress(individualDetails.address),
                               draftClaim.defendant.email)
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        let soleTraderDetails: SoleTraderDetails = draftClaim.claimant.partyDetails as SoleTraderDetails
        return new DefendantAsSoleTrader(soleTraderDetails.name,
                               this.convertAddress(soleTraderDetails.address),
                               draftClaim.defendant.email,
                               soleTraderDetails.businessName)
      case PartyType.COMPANY.value:
        let companyDetails = draftClaim.claimant.partyDetails as CompanyDetails
        return new DefendantAsCompany(companyDetails.name,
                               this.convertAddress(companyDetails.address),
                               draftClaim.defendant.email,
                               companyDetails.contactPerson)
      case PartyType.ORGANISATION.value:
        let organisationDetails = draftClaim.claimant.partyDetails as OrganisationDetails
        return new DefendantAsOrganisation(organisationDetails.name,
                               this.convertAddress(organisationDetails.address),
                               draftClaim.defendant.email,
                               organisationDetails.contactPerson)
      default:
        console.log('Something went wrong, No claimant type is set')
        return undefined
    }
  }

  private static convertAddress (addressForm: AddressForm): Address {
    let address = new Address()
    address.line1 = addressForm.line1
    address.line2 = addressForm.line2
    address.city = addressForm.city
    address.postcode = addressForm.postcode
    return address
  }
}
