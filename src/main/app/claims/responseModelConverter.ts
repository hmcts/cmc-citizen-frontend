import { Validator } from 'class-validator'
import { ResponseDraft } from 'response/draft/responseDraft'
import { QualifiedStatementOfTruth } from 'response/form/models/qualifiedStatementOfTruth'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseCommon'
import { FullDefenceResponse, DefenceType } from 'claims/models/response/fullDefenceResponse'
import { PartAdmissionResponse, PartAdmissionType } from 'claims/models/response/partAdmissionResponse'
import { PartyType } from 'app/common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { Address } from 'app/claims/models/address'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'
import { HowMuchOwed } from 'claims/models/response/howMuchOwed'
import { Timeline } from 'claims/models/response/timeline'
import { Evidence, EvidenceType } from 'claims/models/response/evidence'
import { PaymentPlan, PaymentSchedule } from 'app/claims/models/response/paymentPlan'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { Defendant } from 'drafts/models/defendant'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { ResponseType as DraftResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { RejectPartOfClaim, RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { HowMuchOwed as DraftHowMuchOwed } from 'response/form/models/howMuchOwed'
import { Timeline as DraftTimeline } from 'response/form/models/timeline'
import { Evidence as DraftEvidence } from 'response/form/models/evidence'
import { EvidenceType as DraftEvidenceType } from 'response/form/models/evidenceType'
import { DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { PaymentSchedule as DraftPaymentSchedule } from 'ccj/form/models/paymentSchedule'

const validator: Validator = new Validator()

const responseConverters = {
  [DraftResponseType.DEFENCE.value]: convertFullDefence,
  [DraftResponseType.PART_ADMISSION.value]: convertPartAdmission
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

function convertPartAdmission (draft: ResponseDraft): PartAdmissionResponse {
  return {
    ...convertCommon(draft),
    responseType: ResponseType.PART_ADMISSION,
    partAdmissionType: convertPartAdmissionType(draft.rejectPartOfClaim),
    howMuchOwed: convertHowMuchOwed(draft.howMuchOwed),
    impactOfDispute: draft.impactOfDispute.text,
    timeline: convertTimeline(draft.timeline),
    evidence: convertEvidence(draft.evidence),
    paymentPlan: mapOptional(convertPaymentPlan)(draft.defendantPaymentPlan)
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

function convertPartAdmissionType (draft: RejectPartOfClaim): PartAdmissionType {
  switch (draft.option) {
    case RejectPartOfClaimOption.AMOUNT_TOO_HIGH:
      return PartAdmissionType.AMOUNT_TOO_HIGH
    case RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED:
      return PartAdmissionType.PAID_WHAT_BELIEVED_WAS_OWED
  }
}

function convertHowMuchOwed (draft: DraftHowMuchOwed): HowMuchOwed {
  return {
    amount: draft.amount,
    explanation: draft.text
  }
}

function convertTimeline (draft: DraftTimeline): Timeline {
  return draft.getPopulatedRowsOnly()
  .map(row => ({
    date: row.date,
    description: row.description
  }))
}

function convertEvidence (draft: DraftEvidence): Evidence {
  return draft.getPopulatedRowsOnly()
  .map(row => ({
    type: mapEvidenceType(row.type),
    description: row.description
  }))

  function mapEvidenceType (draft: DraftEvidenceType): EvidenceType {
    switch (draft.value) {
      case DraftEvidenceType.CONTRACTS_AND_AGREEMENTS.value:
        return EvidenceType.CONTRACTS_AND_AGREEMENTS
      case DraftEvidenceType.EXPERT_WITNESS.value:
        return EvidenceType.EXPERT_WITNESS
      case DraftEvidenceType.CORRESPONDENCE.value:
        return EvidenceType.CORRESPONDENCE
      case DraftEvidenceType.PHOTO.value:
        return EvidenceType.PHOTO
      case DraftEvidenceType.RECEIPTS.value:
        return EvidenceType.RECEIPTS
      case DraftEvidenceType.STATEMENT_OF_ACCOUNT.value:
        return EvidenceType.STATEMENT_OF_ACCOUNT
      case DraftEvidenceType.OTHER.value:
        return EvidenceType.OTHER
    }
  }
}

function convertPaymentPlan (draft: DefendantPaymentPlan): PaymentPlan {
  if (validator.validateSync(draft).length > 0) {
    return undefined
  }

  return {
    explanation: draft.text,
    paymentSchedule: mapPaymentSchedule(draft.paymentSchedule),
    firstPaymentDate: draft.firstPaymentDate.toMoment(),
    firstPayment: draft.firstPayment,
    instalmentAmount: draft.instalmentAmount
  }

  function mapPaymentSchedule (draft: DraftPaymentSchedule): PaymentSchedule {
    switch (draft.value) {
      case DraftPaymentSchedule.EACH_WEEK.value:
        return PaymentSchedule.EACH_WEEK
      case DraftPaymentSchedule.EVERY_TWO_WEEKS.value:
        return PaymentSchedule.EVERY_TWO_WEEKS
      case DraftPaymentSchedule.EVERY_MONTH.value:
        return PaymentSchedule.EVERY_MONTH
    }
  }
}

function mapOptional<T, R> (f: ((arg: T) => R)): ((arg?: T) => R | undefined) {
  return x => x !== undefined ? f(x) : undefined
}
