import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse = claim.response as FullAdmissionResponse
      res.render(Paths.defendantsResponsePage.associatedView, {
        claim: claim,
        totalMonthlyIncome: calculateTotalMonthlyIncome(response.statementOfMeans.incomes),
        totalMonthlyExpenses: calculateTotalMonthlyExpense(response.statementOfMeans.expenses)
      })
    })
  )
  .post(
    Paths.defendantsResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      draft.document.viewedDefendantResponse = true
      const user: User = res.locals.user
      await new DraftService().save(draft, user.bearerToken)
      const claim: Claim = res.locals.claim
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))

    }))

function calculateTotalMonthlyIncome (incomes: Income[]) {
  const incomeSources = incomes.map(income => IncomeExpenseSource.fromClaimIncome(income))
  return CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeSources)
}

function calculateTotalMonthlyExpense (expenses: Expense[]) {
  const expenseSources = expenses.map(expense => IncomeExpenseSource.fromClaimExpense(expense))
  return CalculateMonthlyIncomeExpense.calculateTotalAmount(expenseSources)
}
