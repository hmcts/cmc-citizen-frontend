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
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { ResponseType } from 'claims/models/response/responseType'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.response.responseType === ResponseType.FULL_ADMISSION
    || (claim.response.responseType === ResponseType.PART_ADMISSION)
    || claim.response.responseType === ResponseType.FULL_DEFENCE && claim.response.paymentDeclaration !== undefined
}, (req: express.Request): void => {
  throw new NotFoundError(req.path)
})

function calculateTotalMonthlyIncome (statementOfMeans: StatementOfMeans): number {
  if (statementOfMeans === undefined || statementOfMeans.incomes === undefined) {
    return 0
  }

  const incomeSources = statementOfMeans.incomes.map(income => IncomeExpenseSource.fromClaimIncome(income))
  return CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeSources)
}

function calculateTotalMonthlyExpense (statementOfMeans: StatementOfMeans): number {
  if (statementOfMeans === undefined || statementOfMeans.expenses === undefined) {
    return 0
  }

  const expenseSources = statementOfMeans.expenses.map(expense => IncomeExpenseSource.fromClaimExpense(expense))
  return CalculateMonthlyIncomeExpense.calculateTotalAmount(expenseSources)
}

function renderView (res: express.Response, page: number): void {
  const claim: Claim = res.locals.claim
  const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)

  if (alreadyPaid) {
    const partiallyPaid: boolean = StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)
    res.render(Paths.defendantsResponsePage.associatedView, {
      claim: claim,
      page: page,
      alreadyPaid: alreadyPaid,
      partiallyPaid: partiallyPaid
    })
  } else {
    const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    res.render(Paths.defendantsResponsePage.associatedView, {
      claim: claim,
      totalMonthlyIncome: calculateTotalMonthlyIncome(response.statementOfMeans),
      totalMonthlyExpenses: calculateTotalMonthlyExpense(response.statementOfMeans),
      paymentPlan: PaymentPlanHelper.createPaymentPlanFromClaim(claim),
      page: page,
      alreadyPaid: alreadyPaid
    })
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const page: number = 0
      renderView(res, page)
    }
  )
  .post(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user

      if (req.body.action && req.body.action.showPage && !StatesPaidHelper.isResponseAlreadyPaid(claim)) {
        const page: number = +req.body.action.showPage
        return renderView(res, page)
      }

      draft.document.defendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
