import * as express from 'express'

import { Paths as ClaimantsResponsePaths } from 'claimant-response/paths'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'
import { Form } from 'forms/form'
import { ErrorHandling } from 'shared/errorHandling'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNoOption } from 'models/yesNoOption'

import { Claim } from 'claims/models/claim'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { CourtOrderHelper } from 'shared/helpers/courtOrderHelper'

import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { Expense } from 'claims/models/response/statement-of-means/expense'
import { Income } from 'claims/models/response/statement-of-means/income'

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

function renderView (form: Form<AcceptCourtOffer>, res: express.Response) {
  const claim: Claim = res.locals.claim
  const draft: DraftClaimantResponse = res.locals.draft.document
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

  const defendantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
  const courtOrderAmount: number = CourtOrderHelper.createCourtOrder(claim, draft).calculateAmount()

  const courtOrderPaymentPlan: PaymentPlan = new PaymentPlan(
    defendantPaymentPlan.totalAmount,
    courtOrderAmount,
    Frequency.MONTHLY,
    defendantPaymentPlan.startDate
  )

  res.render(ClaimantsResponsePaths.courtOfferPage.associatedView, {
    form: form,
    claim: claim,
    totalMonthlyIncome: calculateTotalMonthlyIncome(response.statementOfMeans.incomes),
    totalMonthlyExpenses: calculateTotalMonthlyExpense(response.statementOfMeans.expenses),
    courtOrderPaymentPlan: courtOrderPaymentPlan.convertTo(defendantPaymentPlan.frequency)
  })
}

async function saveAndRedirect (res: express.Response, draft: Draft<DraftClaimantResponse>, url: string) {
  const user: User = res.locals.user

  await new DraftService().save(draft, user.bearerToken)
  res.redirect(url)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    ClaimantsResponsePaths.courtOfferPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.acceptCourtOffer), res)
    }))

  .post(
    ClaimantsResponsePaths.courtOfferPage.uri,
    FormValidator.requestHandler(AcceptCourtOffer, AcceptCourtOffer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<AcceptCourtOffer> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

        draft.document.acceptCourtOffer = form.model
        
        const { externalId } = req.params

        if (form.model.acceptCourtOffer.option === YesNoOption.YES.option) {
          draft.document.courtOrderAmount = CourtOrderHelper
            .createCourtOrder(claim, draft.document)
            .calculateAmount()
          saveAndRedirect(res, draft, ClaimantsResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          saveAndRedirect(res, draft, ClaimantsResponsePaths.rejectionReasonPage.evaluateUri({ externalId: externalId }))
        }
      }
    }
  )
)
