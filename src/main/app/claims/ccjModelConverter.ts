import { Draft } from '@hmcts/draft-store-client'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { RepaymentPlan as ResponseRepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Moment } from 'moment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'models/yesNoOption'
import { Claim } from 'claims/models/claim'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { LocalDate } from 'forms/models/localDate'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PaymentPlan } from 'shared/components/payment-intention/model/paymentPlan'
import { PaymentOption } from 'shared/components/payment-intention/model/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { PartyType } from 'common/partyType'
import { Individual } from 'claims/models/details/theirs/individual'

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

function getDateOfBirth (claim: Claim): Moment {
  const defendant = claim.response.defendant
  if (defendant.type === PartyType.INDIVIDUAL.value) {
    const user: Individual = new Individual().deserialize(defendant)
    return MomentFactory.parse(user.dateOfBirth)
  }
  return undefined
}

function getDefendantPaymentIntention (claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
  const paymentIntention = new PaymentIntention()

  if (response.paymentIntention) {
    paymentIntention.paymentOption = new PaymentOption(PaymentType.valueOf(response.paymentIntention.paymentOption))
    paymentIntention.paymentDate = response.paymentIntention.paymentDate && new PaymentDate(
      new LocalDate(response.paymentIntention.paymentDate.year(), response.paymentIntention.paymentDate.month(), response.paymentIntention.paymentDate.date())
    )

    const repaymentPlan: ResponseRepaymentPlan = response.paymentIntention.repaymentPlan

    paymentIntention.paymentPlan = repaymentPlan && new PaymentPlan(claim.totalAmountTillToday,
      repaymentPlan.instalmentAmount,
      new LocalDate(repaymentPlan.firstPaymentDate.year(), repaymentPlan.firstPaymentDate.month(), repaymentPlan.firstPaymentDate.date()),
      PaymentSchedule.of(repaymentPlan.paymentSchedule)
    )
  }
  return paymentIntention
}

export class CCJModelConverter {

  static convertForIssue (claim: Claim, draft: Draft<DraftClaimantResponse>): CountyCourtJudgment {
    const claimantResponse = draft.document

    const acceptDefendantOffer = claimantResponse.acceptPaymentMethod.accept.option === YesNoOption.YES.option

    const paymentIntention: PaymentIntention = acceptDefendantOffer ? getDefendantPaymentIntention(claim)
      : claimantResponse.alternatePaymentMethod

    let repaymentPlan: RepaymentPlan
    let payBySetDate: Moment
    let paymentOption: string

    if (paymentIntention) {
      repaymentPlan = paymentIntention.paymentPlan && new RepaymentPlan(paymentIntention.paymentPlan.instalmentAmount,
        paymentIntention.paymentPlan.firstPaymentDate.toMoment(),
        paymentIntention.paymentPlan.paymentSchedule.value)
      payBySetDate = paymentIntention.paymentDate && paymentIntention.paymentDate.date.toMoment()
      paymentOption = paymentIntention.paymentOption && paymentIntention.paymentOption.option.value
    }

    const amount: number = claimantResponse.paidAmount && claimantResponse.paidAmount.amount

    return new CountyCourtJudgment(getDateOfBirth(claim), paymentOption, amount, repaymentPlan, payBySetDate)
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
      draft.paymentOption.option.value,
      convertPaidAmount(draft),
      convertRepaymentPlan(draft.repaymentPlan),
      convertPayBySetDate(draft),
      statementOfTruth
    )
  }
}
