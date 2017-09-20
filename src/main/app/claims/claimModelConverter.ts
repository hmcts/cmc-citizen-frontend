import DraftClaim from 'drafts/models/draftClaim'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyType } from 'app/common/partyType'
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
import ClaimAmountBreakdown from 'app/forms/models/claimAmountBreakdown'
import DraftInterestDate from 'app/forms/models/interestDate'
import InterestDateType from 'app/common/interestDateType'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

export class ClaimModelConverter {

  static convert (draftClaim: DraftClaim): ClaimData {
    const claimData: ClaimData = new ClaimData()
    claimData.interest = draftClaim.interest
    claimData.externalId = draftClaim.externalId
    claimData.interestDate = this.convertInterestDate(draftClaim.interestDate)
    claimData.amount = new ClaimAmountBreakdown().deserialize(draftClaim.amount)
    claimData.feeAmountInPennies = draftClaim.claimant.payment.amount
    claimData.claimant = this.convertClaimantDetails(draftClaim)
    claimData.defendants = [this.convertDefendantDetails(draftClaim)]
    claimData.payment = draftClaim.claimant.payment
    claimData.reason = draftClaim.reason.reason
    claimData.feeAmountInPennies = draftClaim.claimant.payment.amount
    if (draftClaim.qualifiedStatementOfTruth && draftClaim.qualifiedStatementOfTruth.signerName) {
      claimData.statementOfTruth = new StatementOfTruth(
        draftClaim.qualifiedStatementOfTruth.signerName,
        draftClaim.qualifiedStatementOfTruth.signerRole
      )
    }
    return claimData
  }

  private static convertClaimantDetails (draftClaim: DraftClaim): Party {
    switch (draftClaim.claimant.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        const individualDetails = draftClaim.claimant.partyDetails as IndividualDetails

        return new ClaimantAsIndividual(
          individualDetails.name,
          this.convertAddress(individualDetails.address),
          individualDetails.hasCorrespondenceAddress ? this.convertAddress(individualDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.mobilePhone.number,
          undefined,
          individualDetails.dateOfBirth.date.asString()
        )

      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        const soleTraderDetails: SoleTraderDetails = draftClaim.claimant.partyDetails as SoleTraderDetails

        return new ClaimantAsSoleTrader(
          soleTraderDetails.name,
          this.convertAddress(soleTraderDetails.address),
          soleTraderDetails.hasCorrespondenceAddress ? this.convertAddress(soleTraderDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.mobilePhone.number,
          undefined,
          soleTraderDetails.businessName
        )

      case PartyType.COMPANY.value:
        const companyDetails = draftClaim.claimant.partyDetails as CompanyDetails

        return new ClaimantAsCompany(
          companyDetails.name,
          this.convertAddress(companyDetails.address),
          companyDetails.hasCorrespondenceAddress ? this.convertAddress(companyDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.mobilePhone.number,
          undefined,
          companyDetails.contactPerson
        )

      case PartyType.ORGANISATION.value:
        const organisationDetails = draftClaim.claimant.partyDetails as OrganisationDetails

        return new ClaimantAsOrganisation(
          organisationDetails.name,
          this.convertAddress(organisationDetails.address),
          organisationDetails.hasCorrespondenceAddress ? this.convertAddress(organisationDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.mobilePhone.number,
          undefined,
          organisationDetails.contactPerson
        )

      default:
        throw Error('Something went wrong, No claimant type is set')
    }
  }

  private static convertDefendantDetails (draftClaim: DraftClaim): TheirDetails {
    const defendantDetails: PartyDetails = draftClaim.defendant.partyDetails
    switch (defendantDetails.type) {
      case PartyType.INDIVIDUAL.value:
        const individualDetails = defendantDetails as IndividualDetails

        return new DefendantAsIndividual(
          individualDetails.name,
          this.convertAddress(individualDetails.address),
          draftClaim.defendant.email.address
        )

      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        const soleTraderDetails: SoleTraderDetails = defendantDetails as SoleTraderDetails

        return new DefendantAsSoleTrader(
          soleTraderDetails.name,
          this.convertAddress(soleTraderDetails.address),
          draftClaim.defendant.email.address,
          soleTraderDetails.businessName
        )

      case PartyType.COMPANY.value:
        const companyDetails = defendantDetails as CompanyDetails

        return new DefendantAsCompany(
          companyDetails.name,
          this.convertAddress(companyDetails.address),
          draftClaim.defendant.email.address,
          companyDetails.contactPerson
        )
      case PartyType.ORGANISATION.value:
        const organisationDetails = defendantDetails as OrganisationDetails

        return new DefendantAsOrganisation(
          organisationDetails.name,
          this.convertAddress(organisationDetails.address),
          draftClaim.defendant.email.address,
          organisationDetails.contactPerson
        )
      default:
        throw Error('Something went wrong, No defendant type is set')
    }
  }

  private static convertAddress (addressForm: AddressForm): Address {
    const address = new Address()
    address.line1 = addressForm.line1
    if (addressForm.line2) {
      address.line2 = addressForm.line2
    }
    address.city = addressForm.city
    address.postcode = addressForm.postcode
    return address
  }

  private static convertInterestDate (draftInterestDate: DraftInterestDate): InterestDate {
    const interestDate: InterestDate = new InterestDate()
    interestDate.type = draftInterestDate.type
    if (draftInterestDate.type === InterestDateType.CUSTOM) {
      interestDate.date = draftInterestDate.date.toMoment()
      interestDate.reason = draftInterestDate.reason
    }
    return interestDate
  }
}
