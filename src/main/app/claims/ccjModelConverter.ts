import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Moment } from 'moment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Claim } from 'claims/models/claim'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { RepaymentPlan as CoreRepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import { MomentFactory } from 'shared/momentFactory'
import { PartyType } from 'common/partyType'
import { Individual } from 'claims/models/details/yours/individual'

function convertRepaymentPlan (repaymentPlan: RepaymentPlanForm): RepaymentPlan {

  if (repaymentPlan && repaymentPlan.remainingAmount) {
    return new RepaymentPlan(
      repaymentPlan.instalmentAmount,
      repaymentPlan.firstPaymentDate.toMoment(),
      repaymentPlan.paymentSchedule.value
    )
  }

  return undefined
}

function convertPaidAmount (draftCcj: DraftCCJ): number {
  if (draftCcj.paidAmount.option && draftCcj.paidAmount.option.value === PaidAmountOption.YES.value) {
    return draftCcj.paidAmount.amount
  }
  return undefined
}

function convertPayBySetDate (draftCcj: DraftCCJ): Moment {
  return (draftCcj.paymentOption.option === PaymentType.BY_SPECIFIED_DATE)
    ? draftCcj.payBySetDate.date.toMoment() : undefined
}

function getPaymentOption (claim: Claim, draft: DraftCCJ): PaymentOption {
  let response: Response = claim.response
  if (response.responseType === ResponseType.FULL_ADMISSION) {
    let paymentOption: PaymentOption = response.paymentIntention.paymentOption
    return (paymentOption === PaymentOption.INSTALMENTS) ?
      paymentOption : draft.paymentOption.option.value as PaymentOption
  } else if (response.responseType === ResponseType.PART_ADMISSION) {
    let paymentOption: PaymentOption = getPartAdmissionPaymentOption(claim)
    return (paymentOption === PaymentOption.INSTALMENTS) ?
      paymentOption : draft.paymentOption.option.value as PaymentOption
  } else {
    return draft.paymentOption.option.value as PaymentOption
  }
}

function getRepaymentPlan (claim: Claim, draft: DraftCCJ): RepaymentPlan {
  let response: Response = claim.response
  if (response.responseType === ResponseType.FULL_ADMISSION) {
    let fullAdmissionResponse: FullAdmissionResponse = response as FullAdmissionResponse
    let paymentOption: PaymentOption = fullAdmissionResponse.paymentIntention.paymentOption
    let repaymentPlan: CoreRepaymentPlan = fullAdmissionResponse.paymentIntention.repaymentPlan
    if (paymentOption === PaymentOption.INSTALMENTS) {
      let firstPaymentDate: Moment = calculateMonthIncrement(MomentFactory.currentDate(), 1)
      return new RepaymentPlan(repaymentPlan.instalmentAmount,
        firstPaymentDate,
        repaymentPlan.paymentSchedule)
    } else {
      return convertRepaymentPlan(draft.repaymentPlan)
    }
  } else if (response.responseType === ResponseType.PART_ADMISSION) {
    let partAdmissionResponse: PartialAdmissionResponse = response as PartialAdmissionResponse
    let paymentOption: PaymentOption = partAdmissionResponse.paymentIntention.paymentOption
    let repaymentPlan: CoreRepaymentPlan = getPartAdmissionRepaymentPlan(claim)
    if (paymentOption === PaymentOption.INSTALMENTS) {
      let firstPaymentDate: Moment = calculateMonthIncrement(MomentFactory.currentDate(), 1)
      return new RepaymentPlan(repaymentPlan.instalmentAmount,
        firstPaymentDate,
        repaymentPlan.paymentSchedule)
    } else {
      return convertRepaymentPlan(draft.repaymentPlan)
    }
  }
  return convertRepaymentPlan(draft.repaymentPlan)
}

export function getPartAdmissionPaymentOption (claim: Claim): PaymentOption {
  if (claim.claimantResponse && claim.claimantResponse as AcceptationClaimantResponse) {
    let acceptation: AcceptationClaimantResponse = claim.claimantResponse as AcceptationClaimantResponse
    if (acceptation.courtDetermination) {
      return acceptation.courtDetermination.courtPaymentIntention.paymentOption
    }
    return (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption
  }
}

function getPartAdmissionRepaymentPlan (claim: Claim): CoreRepaymentPlan {
  if (claim.claimantResponse && claim.claimantResponse as AcceptationClaimantResponse) {
    let acceptation: AcceptationClaimantResponse = claim.claimantResponse as AcceptationClaimantResponse
    if (acceptation.courtDetermination) {
      return acceptation.courtDetermination.courtPaymentIntention.repaymentPlan
    }
    return (claim.response as PartialAdmissionResponse).paymentIntention.repaymentPlan
  }
}

export class CCJModelConverter {

  static convertForRequest (draft: DraftCCJ, claim: Claim): CountyCourtJudgment {
    let statementOfTruth: StatementOfTruth = undefined
    if (draft.qualifiedDeclaration) {
      // API model is called statement of truth
      statementOfTruth = new StatementOfTruth(
        draft.qualifiedDeclaration.signerName,
        draft.qualifiedDeclaration.signerRole
      )
    }

    let ccjType: CountyCourtJudgmentType = undefined

    let paymentOption: PaymentOption = undefined

    let repaymentPlan: RepaymentPlan = undefined

    let response: Response = claim.response

    let payBySetDate: Moment = undefined

    let defendantDateOfBirth: Moment = undefined

    if (response) {
      ccjType = CountyCourtJudgmentType.ADMISSIONS
      paymentOption = getPaymentOption(claim, draft)
      repaymentPlan = getRepaymentPlan(claim, draft)
      defendantDateOfBirth = response.defendant.type === PartyType.INDIVIDUAL.value ? MomentFactory.parse((response.defendant as Individual).dateOfBirth): undefined
    } else {
      ccjType = CountyCourtJudgmentType.DEFAULT
      paymentOption = draft.paymentOption.option.value as PaymentOption
      repaymentPlan = convertRepaymentPlan(draft.repaymentPlan)
      defendantDateOfBirth = draft.defendantDateOfBirth.known ? draft.defendantDateOfBirth.date.toMoment() : undefined
    }
    payBySetDate = convertPayBySetDate(draft)

    if (!paymentOption) {
      throw new Error('payment option cannot be undefined')
    }

    return new CountyCourtJudgment(
      defendantDateOfBirth,
      paymentOption,
      convertPaidAmount(draft),
      repaymentPlan,
      payBySetDate,
      statementOfTruth,
      ccjType
    )
  }
}
