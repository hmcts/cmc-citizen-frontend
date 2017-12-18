import { ResponseDraft } from 'response/draft/responseDraft'
import { QualifiedStatementOfTruth } from 'response/form/models/qualifiedStatementOfTruth'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseCommon'
import { DefenceType, FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { PartyType } from 'app/common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { Address } from 'app/claims/models/address'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { Defendant } from 'drafts/models/defendant'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { ResponseType as DraftResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'

const responseConverters = {
  [DraftResponseType.DEFENCE.value]: convertFullDefence
}

export namespace ResponseModelConverter {
  export function fromDraft (draft: ResponseDraft): Response {
    return responseConverters[draft.response.type.value](draft)
  }
}

function convertFullDefence (draft: ResponseDraft): FullDefenceResponse {
  return {
    ...convertCommon(draft),
    responseType: ResponseType.FULL_DEFENCE,
    defenceType: convertDefenceType(draft.rejectAllOfClaim),
    defence: draft.defence.text
  }
}

function convertCommon (draft: ResponseDraft) {
  return {
    defendant: convertPartyDetails(draft.defendantDetails),
    freeMediation: draft.freeMediation && draft.freeMediation.option,
    moreTimeNeeded: draft.moreTimeNeeded && draft.moreTimeNeeded.option,
    statementOfTruth: mapOptional(convertStatementOfTruth)(draft.qualifiedStatementOfTruth)
  }
}

function convertStatementOfTruth (draft: QualifiedStatementOfTruth): StatementOfTruth {
  return new StatementOfTruth(
    draft.signerName,
    draft.signerRole
  )
}

function convertPartyDetails (defendant: Defendant): Party {
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

function convertDefenceType (draft: RejectAllOfClaim): DefenceType {
  switch (draft.option) {
    case RejectAllOfClaimOption.ALREADY_PAID:
      return DefenceType.ALREADY_PAID
    case RejectAllOfClaimOption.DISPUTE:
      return DefenceType.DISPUTE
  }

  throw new Error(`Unsupported defence type: ${draft.option}`)
}

function mapOptional<T, R> (f: ((arg: T) => R)): ((arg?: T) => R | undefined) {
  return x => x !== undefined ? f(x) : undefined
}
