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
import { generatePaymentPlan, PaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { ResponseType } from 'claims/models/response/responseType'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const responseType = claim.response.responseType
      let response
      let totalAmount
      let firstPaymentDate

      switch (responseType) {
        case ResponseType.FULL_ADMISSION:
          response = claim.response as FullAdmissionResponse
          totalAmount = response.paymentIntention.repaymentPlan.instalmentAmount
          firstPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate
          break
        case ResponseType.PART_ADMISSION:
          response = claim.response as PartialAdmissionResponse
          totalAmount = response.paymentIntention.repaymentPlan.instalmentAmount
          firstPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate
          break
      }

      const paymentPlan: PaymentPlan = generatePaymentPlan(claim.claimData.amount.totalAmount(), (claim.response as FullAdmissionResponse).paymentIntention.repaymentPlan)

      res.render(Paths.defendantsResponsePage.associatedView, {
        claim: claim,
        totalMonthlyIncome: calculateTotalMonthlyIncome(response.statementOfMeans.incomes),
        totalMonthlyExpenses: calculateTotalMonthlyExpense(response.statementOfMeans.expenses),
        paymentLength: paymentPlan.getPaymentLength(),
        lastPaymentDate: paymentPlan.getLastPaymentDate(),
        totalAmount: totalAmount,
        firstPaymentDate: firstPaymentDate
      })
    })
  )
  .post(
    Paths.defendantsResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      draft.document.defendantResponseViewed = true
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
