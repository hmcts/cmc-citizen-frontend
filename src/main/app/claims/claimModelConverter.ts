import { DraftClaim } from 'drafts/models/draftClaim'
import { MoneyConverter } from 'fees/moneyConverter'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyType } from 'app/common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { ClaimData } from 'claims/models/claimData'
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
import { InterestDate } from 'app/claims/models/interestDate'
import { Address } from 'claims/models/address'
import { Address as AddressForm } from 'forms/models/address'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { InterestDate as DraftInterestDate } from 'claim/form/models/interestDate'
import { InterestDateType } from 'app/common/interestDateType'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { StringUtils } from 'utils/stringUtils'
import { InterestType } from 'claim/form/models/interest'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { Payment } from 'payment-hub-client/payment'

export class ClaimModelConverter {

  static convert (draftClaim: DraftClaim): ClaimData {
    const claimData: ClaimData = new ClaimData()
    claimData.interest = draftClaim.interest
    claimData.externalId = draftClaim.externalId
    if (claimData.interest.type !== InterestType.NO_INTEREST) {
      claimData.interestDate = this.convertInterestDate(draftClaim.interestDate)
    }
    claimData.amount = new ClaimAmountBreakdown().deserialize(draftClaim.amount)
    claimData.claimants = [this.convertClaimantDetails(draftClaim)]
    claimData.defendants = [this.convertDefendantDetails(draftClaim)]
    claimData.payment = this.makeShallowCopy(draftClaim.claimant.payment)
    claimData.reason = draftClaim.reason.reason
    claimData.timeline = { rows : draftClaim.timeline.getPopulatedRowsOnly() } as ClaimantTimeline
    claimData.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(draftClaim.claimant.payment.amount)
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
          StringUtils.trimToUndefined(draftClaim.defendant.email.address)
        )

      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        const soleTraderDetails: SoleTraderDetails = defendantDetails as SoleTraderDetails

        return new DefendantAsSoleTrader(
          soleTraderDetails.name,
          this.convertAddress(soleTraderDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
          soleTraderDetails.businessName
        )

      case PartyType.COMPANY.value:
        const companyDetails = defendantDetails as CompanyDetails

        return new DefendantAsCompany(
          companyDetails.name,
          this.convertAddress(companyDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
          companyDetails.contactPerson
        )
      case PartyType.ORGANISATION.value:
        const organisationDetails = defendantDetails as OrganisationDetails

        return new DefendantAsOrganisation(
          organisationDetails.name,
          this.convertAddress(organisationDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
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
    if (addressForm.line3) {
      address.line3 = addressForm.line3
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

  /**
   * Makes shallow copy to payment object to format that is supported by the backend API.
   *
   * Note: It is workaround to remove all unnecessary properties from {@link PaymentRetrieveResponse}. In
   * long term the intention is to send only payment reference and creation date to backend API.
   *
   * @param {Payment} payment - payment object retrieved from Payment HUB using {@link PayClient#retrieve}
   * @returns {Payment} - simplified payment object required by the backend API
   */
  private static makeShallowCopy (payment: Payment): Payment {
    return {
      reference: payment.reference,
      amount: payment.amount,
      status: payment.status,
      date_created: payment.date_created
    }
  }
}
