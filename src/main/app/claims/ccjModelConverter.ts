import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RepaymentPlan as RepaymentPlanForm } from 'ccj/form/models/repaymentPlan'
import { CCJPaymentOption, PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Moment } from 'moment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Claim } from 'claims/models/claim'
import { Response } from 'claims/models/response'
import { RepaymentPlan as CoreRepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import { MomentFactory } from 'shared/momentFactory'
import { PartyType } from 'common/partyType'
import { Individual } from 'claims/models/details/yours/individual'
import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { Draft as DraftWrapper } from '@hmcts/draft-store-client'
import { DateOfBirth } from 'forms/models/dateOfBirth'

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

export function retrieveDateOfBirthOfDefendant (claim: Claim): DateOfBirth {
  if (claim.response && claim.isAdmissionsResponse() && claim.response.defendant.type === PartyType.INDIVIDUAL.value) {
    const defendantDateOfBirth: Moment = MomentFactory.parse((claim.response.defendant as Individual).dateOfBirth)
    return new DateOfBirth(true, LocalDate.fromMoment(defendantDateOfBirth))
  }
  return undefined
}

export function retrievePaymentOptionsFromClaim (claim: Claim): CCJPaymentOption {
  if (claim.response && claim.isAdmissionsResponse() &&
    ((claim.settlement && claim.settlementReachedAt) || claim.hasDefendantNotSignedSettlementAgreementInTime())) {
    const paymentOptionFromOffer: PaymentOption = claim.settlement.getLastOffer().paymentIntention.paymentOption
    return new CCJPaymentOption(PaymentType.valueOf(paymentOptionFromOffer))
  }
  return undefined
}

export function getRepaymentPlanForm (claim: Claim, draft: DraftWrapper<DraftCCJ>): RepaymentPlanForm {
  if (draft.document.paymentOption.option === PaymentType.INSTALMENTS) {
    if ((claim.settlement && claim.settlementReachedAt) || claim.hasDefendantNotSignedSettlementAgreementInTime()) {
      const coreRepaymentPlan: CoreRepaymentPlan = claim.settlement.getLastOffer().paymentIntention.repaymentPlan
      const firstPaymentDate: Moment = calculateMonthIncrement(MomentFactory.currentDate(), 1)
      const paymentSchedule: PaymentSchedule = PaymentSchedule.of(coreRepaymentPlan.paymentSchedule)
      const alreadyPaid: number = (draft.document.paidAmount.amount || 0)
      const remainingAmount: number = claim.totalAmountTillToday - alreadyPaid
      const repaymentPlanForm: RepaymentPlanForm = new RepaymentPlanForm(
        remainingAmount,
        coreRepaymentPlan.instalmentAmount,
        new LocalDate(firstPaymentDate.year(), firstPaymentDate.month() + 1, firstPaymentDate.date()),
        paymentSchedule)
      return repaymentPlanForm
    }
  }
  return draft.document.repaymentPlan
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

    if (!draft.paymentOption.option) {
      throw new Error('payment option cannot be undefined')
    }

    const paymentOption: PaymentOption = draft.paymentOption.option.value as PaymentOption

    const response: Response = claim.response

    let defendantDateOfBirth: Moment = undefined

    if (claim.response && claim.isAdmissionsResponse()) {
      ccjType = CountyCourtJudgmentType.ADMISSIONS
      if (response.defendant.type === PartyType.INDIVIDUAL.value) {
        defendantDateOfBirth = MomentFactory.parse((response.defendant as Individual).dateOfBirth)
        if (!defendantDateOfBirth) {
          throw new Error('Defendant date of birth cannot be undefined for Admissions response')
        }
      } else {
        defendantDateOfBirth = undefined
      }
    } else {
      ccjType = CountyCourtJudgmentType.DEFAULT
      defendantDateOfBirth = draft.defendantDateOfBirth.known ? draft.defendantDateOfBirth.date.toMoment() : undefined

    }

    return new CountyCourtJudgment(
      defendantDateOfBirth,
      paymentOption,
      convertPaidAmount(draft),
      convertRepaymentPlan(draft.repaymentPlan),
      convertPayBySetDate(draft),
      statementOfTruth,
      ccjType
    )
  }
}
