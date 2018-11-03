import * as express from 'express'

import { AbstractPaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { Frequency } from 'common/frequency/frequency'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'

export class PaymentPlanPage extends AbstractPaymentPlanPage<DraftClaimantResponse> {

  static generateCourtOfferedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtOfferedPaymentIntention = new PaymentIntention()

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      const claimantEnteredPaymentPlan: PaymentPlan = PaymentPlanHelper
        .createPaymentPlanFromDraft(draft)

      courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS

      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS
        && claimResponse.paymentIntention.repaymentPlan.paymentSchedule !== draft.alternatePaymentMethod.toDomainInstance().repaymentPlan.paymentSchedule) {
        const paymentPlanConvertedToDefendantFrequency = claimantEnteredPaymentPlan.convertTo(PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule))

        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: Math.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount * 100) / 100,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }

        return courtOfferedPaymentIntention
      } else {
        courtOfferedPaymentIntention.repaymentPlan = draft.alternatePaymentMethod.toDomainInstance().repaymentPlan

        return courtOfferedPaymentIntention
      }
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const claimantFrequency: Frequency = Frequency.of(draft.alternatePaymentMethod.paymentPlan.paymentSchedule.value)
      const paymentPlanConvertedToClaimantFrequency: PaymentPlan = paymentPlanFromDefendantFinancialStatement.convertTo(claimantFrequency)

      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToClaimantFrequency.startDate,
          instalmentAmount: Math.round(paymentPlanConvertedToClaimantFrequency.instalmentAmount * 100) / 100,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToClaimantFrequency.frequency),
          completionDate: paymentPlanConvertedToClaimantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToClaimantFrequency.calculatePaymentLength()
        }
        return courtOfferedPaymentIntention
      }

      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
        const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
        courtOfferedPaymentIntention.paymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE

        return courtOfferedPaymentIntention
      }
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      return courtOfferedPaymentIntention
    }
  }

  static generateCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType) {
    if (decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT && draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
      return undefined
    }

    const courtCalculatedPaymentIntention = new PaymentIntention()
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    if (!paymentPlan) {
      return undefined
    }
    courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
    courtCalculatedPaymentIntention.repaymentPlan = {
      firstPaymentDate: paymentPlan.startDate,
      instalmentAmount: Math.round(paymentPlan.instalmentAmount * 100) / 100,
      paymentSchedule: Frequency.toPaymentSchedule(paymentPlan.frequency),
      completionDate: paymentPlan.calculateLastPaymentDate(),
      paymentLength: paymentPlan.calculatePaymentLength()
    }

    return courtCalculatedPaymentIntention
  }

  getView (): string {
    return 'claimant-response/views/payment-plan'
  }

  getHeading (): string {
    return 'Suggest instalments for the defendant'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const courtDetermination: CourtDetermination = new CourtDetermination()
    const decisionType: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft.document)
    courtDetermination.decisionType = decisionType

    const courtCalculatedPaymentIntention = PaymentPlanPage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    if (courtCalculatedPaymentIntention) {
      courtDetermination.courtPaymentIntention = courtCalculatedPaymentIntention
    }
    courtDetermination.courtDecision = PaymentPlanPage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    locals.draft.document.courtDetermination = courtDetermination

    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const courtDecision: DecisionType = CourtDecisionHelper.createCourtDecision(claim, draft)
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId
    switch (courtDecision) {
      case DecisionType.COURT: {
        return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.DEFENDANT: {
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
          return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
        }
        break
      }
      case DecisionType.CLAIMANT:
      case DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT: {
        return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentPlanPage()
  .buildRouter(claimantResponsePath,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      if (response.statementOfMeans === undefined) {
        return next(new Error('Page cannot be rendered because response does not have statement of means'))
      }

      next()
    },
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      res.locals.monthlyIncomeAmount = response.statementOfMeans && response.statementOfMeans.incomes ? CalculateMonthlyIncomeExpense.calculateTotalAmount(
        response.statementOfMeans.incomes.map(income => IncomeExpenseSource.fromClaimIncome(income))
      ) : 0
      res.locals.monthlyExpensesAmount = response.statementOfMeans && response.statementOfMeans.expenses ? CalculateMonthlyIncomeExpense.calculateTotalAmount(
        response.statementOfMeans.expenses.map(expense => IncomeExpenseSource.fromClaimExpense(expense))
      ) : 0
      res.locals.statementOfMeans = response.statementOfMeans

      next()
    }
  )
