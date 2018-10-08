import { Draft } from '@hmcts/draft-store-client'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Moment } from 'moment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'models/yesNoOption'
import { Claim } from 'claims/models/claim'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { MomentFactory } from 'shared/momentFactory'
import { PartyType } from 'common/partyType'
import { Individual } from 'claims/models/details/theirs/individual'
import { Party } from 'claims/models/details/yours/party'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

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

function getDateOfBirth (defendant: Party): Moment {
  if (defendant.type === PartyType.INDIVIDUAL.value) {
    return MomentFactory.parse((defendant as Individual).dateOfBirth)
  }
  return undefined
}

function getDefendantPaymentIntention (claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
  return response.paymentIntention
}

export class CCJModelConverter {

  static convertForIssue (claim: Claim, draft: Draft<DraftClaimantResponse>): CountyCourtJudgment {
    const claimantResponse: DraftClaimantResponse = draft.document

    const defendantPaymentMethodAccepted = claimantResponse.acceptPaymentMethod.accept.option === YesNoOption.YES.option

    const paymentIntention: PaymentIntention = defendantPaymentMethodAccepted ? getDefendantPaymentIntention(claim)
      : claimantResponse.alternatePaymentMethod.toDomainInstance()

    const repaymentPlan: RepaymentPlan = paymentIntention.repaymentPlan && new RepaymentPlan(
      paymentIntention.repaymentPlan.instalmentAmount,
      paymentIntention.repaymentPlan.firstPaymentDate,
      paymentIntention.repaymentPlan.paymentSchedule,
      paymentIntention.repaymentPlan.completionDate,
      paymentIntention.repaymentPlan.paymentLength)

    const paymentDate = paymentIntention.paymentDate && paymentIntention.paymentDate
    const paymentOption = paymentIntention.paymentOption
    const alreadyPaidAmount: number = claimantResponse.paidAmount.amount
    return new CountyCourtJudgment(getDateOfBirth(claim.response.defendant), paymentOption, alreadyPaidAmount, repaymentPlan, paymentDate)
  }

  static convertForRequest (draft: DraftCCJ): CountyCourtJudgment {
    let statementOfTruth: StatementOfTruth = undefined
    if (draft.qualifiedDeclaration) {
      // API model is called statement of truth
      statementOfTruth = new StatementOfTruth(
        draft.qualifiedDeclaration.signerName,
        draft.qualifiedDeclaration.signerRole
      )
    }

    return new CountyCourtJudgment(
      draft.defendantDateOfBirth.known ? draft.defendantDateOfBirth.date.toMoment() : undefined,
      draft.paymentOption.option.value as PaymentOption,
      convertPaidAmount(draft),
      convertRepaymentPlan(draft.repaymentPlan),
      convertPayBySetDate(draft),
      statementOfTruth
    )
  }
}
