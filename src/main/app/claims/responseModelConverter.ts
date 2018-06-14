import { ResponseDraft } from 'response/draft/responseDraft'
import { Response } from 'claims/models/response'
import { ResponseType, YesNoOption } from 'claims/models/response/responseCommon'
import { DefenceType, FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { PartyType } from 'common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Party } from 'claims/models/details/yours/party'
import { Individual } from 'claims/models/details/yours/individual'
import { Company } from 'claims/models/details/yours/company'
import { Address } from 'claims/models/address'
import { Organisation } from 'claims/models/details/yours/organisation'
import { SoleTrader } from 'claims/models/details/yours/soleTrader'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { Defendant } from 'drafts/models/defendant'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { ResponseType as FormResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { WhenDidYouPay } from 'response/form/models/whenDidYouPay'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { convertEvidence } from 'claims/converters/evidenceConverter'

export class ResponseModelConverter {

  static convert (responseDraft: ResponseDraft): Response {
    switch (responseDraft.response.type) { // TODO: consider using single type interface / class
      case FormResponseType.DEFENCE:
        return this.convertFullDefence(responseDraft)
      default:
        throw new Error(`Unsupported response type: ${responseDraft.response.type.value}`)
    }
  }

  private static convertFullDefence (draft: ResponseDraft): FullDefenceResponse {
    let paymentDeclaration: PaymentDeclaration = undefined
    if (draft.isResponseRejectedFullyWithAmountClaimedPaid()) {
      paymentDeclaration = this.convertWhenDidYouPay(draft.whenDidYouPay)
    }

    let statementOfTruth: StatementOfTruth = undefined
    if (draft.qualifiedStatementOfTruth) {
      statementOfTruth = new StatementOfTruth(
        draft.qualifiedStatementOfTruth.signerName,
        draft.qualifiedStatementOfTruth.signerRole
      )
    }

    return {
      responseType: ResponseType.FULL_DEFENCE,
      defenceType: this.inferDefenceType(draft),
      defendant: this.convertPartyDetails(draft.defendantDetails),
      moreTimeNeeded: draft.moreTimeNeeded && draft.moreTimeNeeded.option as YesNoOption,
      defence: draft.defence.text,
      timeline: {
        rows: draft.timeline.getPopulatedRowsOnly(),
        comment: draft.timeline.comment
      } as DefendantTimeline,
      evidence: {
        rows: convertEvidence(draft.evidence) as any,
        comment: draft.evidence.comment
      } as DefendantEvidence,
      freeMediation: draft.freeMediation && draft.freeMediation.option as YesNoOption,
      paymentDeclaration,
      statementOfTruth
    }
  }

  // TODO A workaround for Claim Store staff notifications logic to work.
  // Should be removed once partial admission feature is fully done and frontend and backend models are aligned properly.
  private static inferDefenceType (draft: ResponseDraft): DefenceType {
    return draft.rejectAllOfClaim && draft.rejectAllOfClaim.option === RejectAllOfClaimOption.ALREADY_PAID
      ? DefenceType.ALREADY_PAID
      : DefenceType.DISPUTE
  }

  private static convertPartyDetails (defendant: Defendant): Party {
    let party: Party = undefined
    switch (defendant.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        party = new Individual()
        if ((defendant.partyDetails as IndividualDetails).dateOfBirth) {
          (party as Individual).dateOfBirth = (defendant.partyDetails as IndividualDetails).dateOfBirth.date.asString()
        }
        break
      case PartyType.COMPANY.value:
        party = new Company()
        if ((defendant.partyDetails as CompanyDetails).contactPerson) {
          (party as Company).contactPerson = (defendant.partyDetails as CompanyDetails).contactPerson
        }
        break
      case PartyType.ORGANISATION.value:
        party = new Organisation()
        if ((defendant.partyDetails as OrganisationDetails).contactPerson) {
          (party as Organisation).contactPerson = (defendant.partyDetails as OrganisationDetails).contactPerson
        }
        break
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        party = new SoleTrader()
        if ((defendant.partyDetails as SoleTraderDetails).businessName) {
          (party as SoleTrader).businessName = (defendant.partyDetails as SoleTraderDetails).businessName
        }
        break
    }
    party.address = new Address().deserialize(defendant.partyDetails.address)
    if (defendant.partyDetails.hasCorrespondenceAddress) {
      party.correspondenceAddress = new Address().deserialize(defendant.partyDetails.correspondenceAddress)
    }
    party.name = defendant.partyDetails.name
    if (defendant.email) {
      party.email = defendant.email.address
    }
    if (defendant.mobilePhone) {
      party.mobilePhone = defendant.mobilePhone.number
    }
    return party
  }

  private static convertWhenDidYouPay (whenDidYouPay: WhenDidYouPay): PaymentDeclaration {
    if (whenDidYouPay === undefined) {
      return undefined
    }
    return new PaymentDeclaration(whenDidYouPay.date.asString(), whenDidYouPay.text)
  }
}
