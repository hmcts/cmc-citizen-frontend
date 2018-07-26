import { NotFoundError } from 'errors'
import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { GuardFactory } from 'response/guards/guardFactory'
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
import { generatePaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { ResponseType } from 'claims/models/response/responseType'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.response.responseType === ResponseType.FULL_ADMISSION
}, (req: express.Request, res: express.Response): void => {
  throw new NotFoundError(req.path)
})

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      res.render(Paths.defendantsResponsePage.associatedView, {
        claim: claim,
        totalMonthlyIncome: calculateTotalMonthlyIncome(response.statementOfMeans.incomes),
        totalMonthlyExpenses: calculateTotalMonthlyExpense(response.statementOfMeans.expenses),
        paymentPlan: generatePaymentPlan(claim.claimData.amount.totalAmount(), response.paymentIntention.repaymentPlan)
      })
    })
  )
  .post(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user

      draft.document.defendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))

    }))

function calculateTotalMonthlyIncome (incomes: Income[]): number {
  if (incomes === undefined) {
    return 0
  }

  const incomeSources = incomes.map(income => IncomeExpenseSource.fromClaimIncome(income))
  return CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeSources)
}

function calculateTotalMonthlyExpense (expenses: Expense[]): number {
  if (expenses === undefined) {
    return 0
  }

  const expenseSources = expenses.map(expense => IncomeExpenseSource.fromClaimExpense(expense))
  return CalculateMonthlyIncomeExpense.calculateTotalAmount(expenseSources)
}
