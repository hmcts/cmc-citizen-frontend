import * as express from 'express'
import * as _ from 'lodash'

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

import { FormValidationError } from 'forms/form'
import { getEarliestPaymentDateForPaymentPlan } from 'claimant-response/helpers/paydateHelper'
import { ValidationError } from 'class-validator'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { DecisionType } from 'common/court-calculations/decisionType'
import { Frequency } from 'common/frequency/frequency'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'

export class PaymentPlanPage extends AbstractPaymentPlanPage<DraftClaimantResponse> {

  static generateCourtOfferedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtOfferedPaymentIntention = new PaymentIntention()
    const totalClaimAmount: number = AmountHelper.calculateTotalAmount(claim,draft)
    const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
    const claimantEnteredPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft)
    const defendantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim, draft)

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {

      courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS
        && claimResponse.paymentIntention.repaymentPlan.paymentSchedule !== draft.alternatePaymentMethod.toDomainInstance().repaymentPlan.paymentSchedule) {
        const paymentPlanConvertedToDefendantFrequency = claimantEnteredPaymentPlan.convertTo(PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule))
        const instalmentAmount = _.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount,2)

        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: instalmentAmount > totalClaimAmount ? totalClaimAmount : instalmentAmount,
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
      const defendantFrequency: Frequency = Frequency.of(claimResponse.paymentIntention.repaymentPlan.paymentSchedule)
      const claimantRepaymentPlanStartDate: Moment = draft.alternatePaymentMethod.toDomainInstance().repaymentPlan.firstPaymentDate
      const courtOfferedStartDate: Moment =
          paymentPlanFromDefendantFinancialStatement.startDate < claimantRepaymentPlanStartDate ? claimantRepaymentPlanStartDate : paymentPlanFromDefendantFinancialStatement.startDate
      const paymentPlanConvertedToDefendantFrequency: PaymentPlan =
                      paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency, courtOfferedStartDate)

      courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
      courtOfferedPaymentIntention.repaymentPlan = {
        firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
        instalmentAmount: _.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount,2),
        paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
        completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
        paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
      }
      return courtOfferedPaymentIntention
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        const paymentPlanWhenNoDisposableIncome: PaymentPlan = defendantPaymentPlan.convertTo(
          defendantPaymentPlan.frequency,
          claimantEnteredPaymentPlan.startDate)
        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS

        if (paymentPlanFromDefendantFinancialStatement.instalmentAmount === 0) {
          courtOfferedPaymentIntention.repaymentPlan = {
            firstPaymentDate: paymentPlanWhenNoDisposableIncome.startDate,
            instalmentAmount: _.round(paymentPlanWhenNoDisposableIncome.instalmentAmount, 2),
            paymentSchedule: Frequency.toPaymentSchedule(paymentPlanWhenNoDisposableIncome.frequency),
            completionDate: paymentPlanWhenNoDisposableIncome.calculateLastPaymentDate(),
            paymentLength: paymentPlanWhenNoDisposableIncome.calculatePaymentLength()
          }
        } else {
          courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
        }
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      return courtOfferedPaymentIntention
    }
  }

  static generateCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim) {
    const courtCalculatedPaymentIntention = new PaymentIntention()
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
    if (!paymentPlan) {
      return undefined
    }

    if (paymentPlan.startDate.isSame(MomentFactory.maxDate())) {
      courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      courtCalculatedPaymentIntention.paymentDate = MomentFactory.maxDate()
    } else {
      courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
      courtCalculatedPaymentIntention.repaymentPlan = {
        firstPaymentDate: paymentPlan.startDate,
        instalmentAmount: _.round(paymentPlan.instalmentAmount,2),
        paymentSchedule: Frequency.toPaymentSchedule(paymentPlan.frequency),
        completionDate: paymentPlan.calculateLastPaymentDate(),
        paymentLength: paymentPlan.calculatePaymentLength()
      }
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
    const decisionType: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft.document)
    if (decisionType !== DecisionType.NOT_APPLICABLE_IS_BUSINESS) {
      locals.draft.document.courtDetermination.decisionType = decisionType

      const courtCalculatedPaymentIntention = PaymentPlanPage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim)
      if (courtCalculatedPaymentIntention) {
        locals.draft.document.courtDetermination.courtPaymentIntention = courtCalculatedPaymentIntention
      }
      locals.draft.document.courtDetermination.courtDecision = PaymentPlanPage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    }
    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const courtDecision: DecisionType = CourtDecisionHelper.createCourtDecision(claim, draft)
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId

    switch (courtDecision) {
      case DecisionType.NOT_APPLICABLE_IS_BUSINESS:
        return Paths.taskListPage.evaluateUri({ externalId: externalId })
      case DecisionType.COURT: {
        return Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.DEFENDANT: {
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
          return Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })
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

  postValidation (req: express.Request, res: express.Response): FormValidationError {
    const model = req.body.model
    if (model.firstPaymentDate) {
      const validDate: Moment = getEarliestPaymentDateForPaymentPlan(res.locals.claim, model.firstPaymentDate.toMoment())
      if (validDate && validDate > model.firstPaymentDate.toMoment()) {
        const error: ValidationError = {
          target: model,
          property: 'firstPaymentDate',
          value: model.firstPaymentDate.toMoment(),
          constraints: { 'Failed': 'Enter a date of  ' + validDate.format('DD MM YYYY') + ' or later for the first instalment' },
          children: undefined
        }
        return new FormValidationError(error)
      }
    }
    return undefined
  }
}

/* tslint:disable:no-default-export */
export default new PaymentPlanPage()
  .buildRouter(claimantResponsePath,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      if (!claim.claimData.defendant.isBusiness()) {
        if (response.statementOfMeans === undefined) {
          return next(new Error('Page cannot be rendered because response does not have statement of means'))
        }
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
