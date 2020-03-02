import { DraftClaim } from 'drafts/models/draftClaim'
import { MoneyConverter } from 'fees/moneyConverter'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyType } from 'common/partyType'
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
import { Address } from 'claims/models/address'
import { Address as AddressForm } from 'forms/models/address'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { StringUtils } from 'utils/stringUtils'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { Payment } from 'payment-hub-client/payment'
import { Evidence } from 'forms/models/evidence'
import { convertEvidence } from 'claims/converters/evidenceConverter'
import { InterestDate } from 'claims/models/interestDate'
import { Interest } from 'claims/models/interest'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestDateType } from 'common/interestDateType'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import { YesNoOption } from 'models/yesNoOption'
import { getStandardInterestRate } from 'shared/interestUtils'
import { InterestBreakdown } from 'claims/models/interestBreakdown'
import { InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { Phone } from 'forms/models/phone'

export class ClaimModelConverter {

  static convert (draftClaim: DraftClaim): ClaimData {
    const claimData: ClaimData = new ClaimData()
    claimData.externalId = draftClaim.externalId
    claimData.interest = this.convertInterest(draftClaim)
    claimData.amount = new ClaimAmountBreakdown().deserialize(draftClaim.amount)
    claimData.claimants = [this.convertClaimantDetails(draftClaim)]
    claimData.defendants = [this.convertDefendantDetails(draftClaim)]
    claimData.payment = this.makeShallowCopy(draftClaim.claimant.payment)
    claimData.reason = draftClaim.reason.reason
    claimData.timeline = { rows: draftClaim.timeline.getPopulatedRowsOnly() } as ClaimantTimeline
    claimData.evidence = { rows: convertEvidence(draftClaim.evidence) as any } as Evidence
    if (draftClaim.claimant.payment) {
      claimData.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(draftClaim.claimant.payment.amount)
    }
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
          draftClaim.claimant.phone.number,
          undefined,
          individualDetails.dateOfBirth.date.asString()
        )

      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        const soleTraderDetails: SoleTraderDetails = draftClaim.claimant.partyDetails as SoleTraderDetails

        return new ClaimantAsSoleTrader(
          soleTraderDetails.name,
          this.convertAddress(soleTraderDetails.address),
          soleTraderDetails.hasCorrespondenceAddress ? this.convertAddress(soleTraderDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.phone.number,
          undefined,
          soleTraderDetails.businessName
        )

      case PartyType.COMPANY.value:
        const companyDetails = draftClaim.claimant.partyDetails as CompanyDetails

        return new ClaimantAsCompany(
          companyDetails.name,
          this.convertAddress(companyDetails.address),
          companyDetails.hasCorrespondenceAddress ? this.convertAddress(companyDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.phone.number,
          undefined,
          companyDetails.contactPerson
        )

      case PartyType.ORGANISATION.value:
        const organisationDetails = draftClaim.claimant.partyDetails as OrganisationDetails

        return new ClaimantAsOrganisation(
          organisationDetails.name,
          this.convertAddress(organisationDetails.address),
          organisationDetails.hasCorrespondenceAddress ? this.convertAddress(organisationDetails.correspondenceAddress) : undefined,
          draftClaim.claimant.phone.number,
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
          StringUtils.trimToUndefined(individualDetails.title),
          individualDetails.firstName,
          individualDetails.lastName,
          this.convertAddress(individualDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
          this.convertPhoneNumber(draftClaim.defendant.phone)
        )

      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        const soleTraderDetails: SoleTraderDetails = defendantDetails as SoleTraderDetails

        return new DefendantAsSoleTrader(
          StringUtils.trimToUndefined(soleTraderDetails.title),
          soleTraderDetails.firstName,
          soleTraderDetails.lastName,
          this.convertAddress(soleTraderDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
          soleTraderDetails.businessName,
          this.convertPhoneNumber(draftClaim.defendant.phone)
        )

      case PartyType.COMPANY.value:
        const companyDetails = defendantDetails as CompanyDetails

        return new DefendantAsCompany(
          companyDetails.name,
          this.convertAddress(companyDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
          companyDetails.contactPerson,
          this.convertPhoneNumber(draftClaim.defendant.phone)
        )
      case PartyType.ORGANISATION.value:
        const organisationDetails = defendantDetails as OrganisationDetails

        return new DefendantAsOrganisation(
          organisationDetails.name,
          this.convertAddress(organisationDetails.address),
          StringUtils.trimToUndefined(draftClaim.defendant.email.address),
          organisationDetails.contactPerson,
          this.convertPhoneNumber(draftClaim.defendant.phone)
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

  private static convertInterest (draftClaim: DraftClaim): Interest {
    const interest: Interest = new Interest()

    if (draftClaim.interest.option === YesNoOption.NO) {
      interest.type = ClaimInterestType.NO_INTEREST
    } else {
      if (draftClaim.interestType.option === InterestTypeOption.SAME_RATE) {
        interest.type = draftClaim.interestRate.type
        interest.rate = draftClaim.interestRate.rate
        if (draftClaim.interestRate.type === InterestRateOption.DIFFERENT) {
          interest.reason = draftClaim.interestRate.reason
        }
      } else {
        const interestBreakdown = new InterestBreakdown()
        interestBreakdown.totalAmount = draftClaim.interestTotal.amount
        interestBreakdown.explanation = draftClaim.interestTotal.reason
        interest.interestBreakdown = interestBreakdown
        interest.type = ClaimInterestType.BREAKDOWN
        if (draftClaim.interestContinueClaiming.option === YesNoOption.YES) {
          if (draftClaim.interestHowMuch.type === InterestRateOption.STANDARD) {
            interest.rate = getStandardInterestRate()
          } else {
            interest.specificDailyAmount = draftClaim.interestHowMuch.dailyAmount
          }
        }
      }
      interest.interestDate = this.convertInterestDate(draftClaim)
    }

    return interest
  }

  private static convertInterestDate (draftClaim: DraftClaim): InterestDate {
    const interestDate: InterestDate = new InterestDate()
    if (draftClaim.interestType.option === InterestTypeOption.SAME_RATE) {
      interestDate.type = draftClaim.interestDate.type
      if (draftClaim.interestDate.type === InterestDateType.CUSTOM) {
        interestDate.date = draftClaim.interestStartDate.date.toMoment()
        interestDate.reason = draftClaim.interestStartDate.reason
        interestDate.endDateType = draftClaim.interestEndDate.option
      }
    }
    if (
      draftClaim.interestType.option === InterestTypeOption.BREAKDOWN &&
      draftClaim.interestContinueClaiming.option === YesNoOption.NO
    ) {
      interestDate.endDateType = InterestEndDateOption.SUBMISSION
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
    if (!payment || Object.keys(payment).length === 0) {
      return undefined
    }
    return {
      reference: payment.reference,
      amount: payment.amount,
      status: payment.status,
      date_created: payment.date_created
    }
  }

  private static convertPhoneNumber (phone: Phone): string {
    return phone ? StringUtils.trimToUndefined(phone.number) : undefined
  }
}
