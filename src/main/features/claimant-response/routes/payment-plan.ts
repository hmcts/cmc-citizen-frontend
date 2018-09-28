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
import { Moment } from 'moment'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { DecisionType } from 'common/court-calculations/courtDetermination'
import { Frequency } from 'common/frequency/frequency'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'

class PaymentPlanPage extends AbstractPaymentPlanPage<DraftClaimantResponse> {
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
    const getCourtDecision: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft)

    locals.draft.document.courtDecisionType = getCourtDecision
    locals.draft.document.courtOfferedPaymentIntention = this.generateCourtCalculatedPaymentIntention(locals.draft, locals.claim, getCourtDecision)

    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.draft
    const courtDecision = CourtDecisionHelper.createCourtDecision(claim, draft)

    const externalId: string = req.params.externalId
    switch (courtDecision) {
      case DecisionType.COURT:
      case DecisionType.DEFENDANT: {
        return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.CLAIMANT: {
        return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  generateCourtCalculatedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtCalculatedPaymentIntention = new PaymentIntention()

    if (decisionType === DecisionType.CLAIMANT) {
      const claimantEnteredPaymentPlan: PaymentPlan = PaymentPlanHelper
      .createPaymentPlanFromDraft(draft.document)

      courtCalculatedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.toDomainInstance().paymentOption

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS
         && PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule) !== claimantEnteredPaymentPlan.frequency) {
        const paymentPlanConvertedToDefendantFrequency = claimantEnteredPaymentPlan.convertTo(PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule))

        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: paymentPlanConvertedToDefendantFrequency.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }

        return courtCalculatedPaymentIntention
      } else {
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: claimantEnteredPaymentPlan.startDate,
          instalmentAmount: claimantEnteredPaymentPlan.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(claimantEnteredPaymentPlan.frequency),
          completionDate: claimantEnteredPaymentPlan.calculateLastPaymentDate(),
          paymentLength: claimantEnteredPaymentPlan.calculatePaymentLength()
        }

        return courtCalculatedPaymentIntention
      }
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()

      courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
      courtCalculatedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.toDomainInstance().paymentOption
      courtCalculatedPaymentIntention.repaymentPlan = {
        firstPaymentDate: paymentPlanFromDefendantFinancialStatement.startDate,
        instalmentAmount: paymentPlanFromDefendantFinancialStatement.instalmentAmount,
        paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency),
        completionDate: paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate(),
        paymentLength: paymentPlanFromDefendantFinancialStatement.calculatePaymentLength()
      }

      return courtCalculatedPaymentIntention
    }

    if (decisionType === DecisionType.DEFENDANT) {
      const paymentPlanFromDefendant: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
      const lastPaymentDate: Moment = paymentPlanFromDefendant.calculateLastPaymentDate()

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanFromDefendant.startDate,
          instalmentAmount: paymentPlanFromDefendant.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendant.frequency),
          completionDate: paymentPlanFromDefendant.calculateLastPaymentDate(),
          paymentLength: paymentPlanFromDefendant.calculatePaymentLength()
        }
        courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
        courtCalculatedPaymentIntention.paymentOption = claimResponse.paymentIntention.paymentOption
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
        const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()

        courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
        courtCalculatedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.toDomainInstance().paymentOption
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanFromDefendantFinancialStatement.startDate,
          instalmentAmount: paymentPlanFromDefendantFinancialStatement.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency),
          completionDate: paymentPlanFromDefendant.calculateLastPaymentDate(),
          paymentLength: paymentPlanFromDefendantFinancialStatement.calculatePaymentLength()
        }
      }

      return courtCalculatedPaymentIntention
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

      res.locals.monthlyIncomeAmount = response.statementOfMeans.incomes ? CalculateMonthlyIncomeExpense.calculateTotalAmount(
        response.statementOfMeans.incomes.map(income => IncomeExpenseSource.fromClaimIncome(income))
      ) : 0
      res.locals.monthlyExpensesAmount = response.statementOfMeans.expenses ? CalculateMonthlyIncomeExpense.calculateTotalAmount(
        response.statementOfMeans.expenses.map(expense => IncomeExpenseSource.fromClaimExpense(expense))
      ) : 0
      res.locals.statementOfMeans = response.statementOfMeans

      next()
    }
  )
