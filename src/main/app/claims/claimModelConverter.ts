import DraftClaim from 'drafts/models/draftClaim'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyType } from 'forms/models/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import ClaimData from 'claims/models/claimData'
import Party from 'claims/models/party'
import Individual from 'claims/models/individual'
import SoleTrader from 'claims/models/soleTrader'
import Company from 'claims/models/company'
import Organisation from 'claims/models/organisation'
import { Defendant } from 'claims/models/defendant'
import TheirDetails from 'claims/models/theirDetails'
import InterestDate from 'app/claims/models/interestDate'
import { Address } from 'claims/models/address'

export class ClaimModelConverter {

  static convert (draftClaim: DraftClaim): ClaimData {
    let claimData: ClaimData = new ClaimData()
    if (draftClaim.interestDate.date.asString() === '') {
      delete claimData.interestDate.date
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
        return new Individual(individualDetails.name, individualDetails.address,
                               individualDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               individualDetails.dateOfBirth.date.toMoment())
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        let soleTraderDetails: SoleTraderDetails = draftClaim.claimant.partyDetails as SoleTraderDetails
        return new SoleTrader(soleTraderDetails.name, soleTraderDetails.address,
                               soleTraderDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               soleTraderDetails.businessName)
      case PartyType.COMPANY.value:
        let companyDetails = draftClaim.claimant.partyDetails as CompanyDetails
        return new Company(companyDetails.name, companyDetails.address,
                               companyDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               companyDetails.contactPerson)
      case PartyType.ORGANISATION.value:
        let organisationDetails = draftClaim.claimant.partyDetails as OrganisationDetails
        return new Organisation(organisationDetails.name, organisationDetails.address,
                               organisationDetails.correspondenceAddress,
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
        break
    }
    
    let defendant = new TheirDetails()
    defendant.address = new Address()
    defendant.address.line1 = defendantDetails.address.line1
    defendant.address.postcode = defendantDetails.address.postcode
    defendant.name = defendantDetails.name as any
    // delete draftClaim.defendant.partyDetails

    // if (!draftClaim.defendant.dateOfBirth || !draftClaim.defendant.dateOfBirth.date) {
    //   delete draftClaim.defendant.dateOfBirth
   // }

    if (!draftClaim.defendant.email) {
      defendant.email = draftClaim.defendant.email
    }

  switch (defendantDetails.type) {
      case PartyType.INDIVIDUAL.value:
        let individualDetails = defendantDetails as IndividualDetails
        return new Individual(individualDetails.name, individualDetails.address,
                               individualDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               individualDetails.dateOfBirth.date.toMoment())
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        let soleTraderDetails: SoleTraderDetails = draftClaim.claimant.partyDetails as SoleTraderDetails
        return new SoleTrader(soleTraderDetails.name, soleTraderDetails.address,
                               soleTraderDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               soleTraderDetails.businessName)
      case PartyType.COMPANY.value:
        let companyDetails = draftClaim.claimant.partyDetails as CompanyDetails
        return new Company(companyDetails.name, companyDetails.address,
                               companyDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               companyDetails.contactPerson)
      case PartyType.ORGANISATION.value:
        let organisationDetails = draftClaim.claimant.partyDetails as OrganisationDetails
        return new Organisation(organisationDetails.name, organisationDetails.address,
                               organisationDetails.correspondenceAddress,
                               draftClaim.claimant.mobilePhone,
                               undefined,
                               organisationDetails.contactPerson)
      default:
        console.log('Something went wrong, No claimant type is set')
        return undefined
    }  







    return defendant
  }
}
