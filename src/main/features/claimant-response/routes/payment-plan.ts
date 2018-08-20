import * as express from 'express'
import { Logger } from '@hmcts/nodejs-logging'

import { AbstractPaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { claimantResponsePath, Paths } from 'claimant-response/paths'

import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { DeterminationOfMeansCalculations } from 'common/determination-of-means/determinationOfMeansCalculations'
import { StatementOfMeansCalculations } from 'common/statement-of-means/statementOfMeansCalculations'

const logger = Logger.getLogger('features/claimant-response/routes/payment-plan')

class PaymentPlanPage extends AbstractPaymentPlanPage<DraftClaimantResponse> {
  getView (): string {
    return 'claimant-response/views/payment-plan'
  }

  getHeading (): string {
    return 'Suggest instalments for the defendant'
  }

  getValidationGroup (): string {
    return 'claimant-suggestion'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const claimPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
    const draftPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(res.locals.draft.document)

    const defendantMonthlyInstalmentAmount: number = claimPaymentPlan.calculateMonthlyInstalmentAmount()
    const claimantMonthlyInstalmentAmount: number = draftPaymentPlan.calculateMonthlyInstalmentAmount()
    const defendantMonthlyDisposableIncome: number = StatementOfMeansCalculations.calculateTotalMonthlyDisposableIncome(claimResponse.statementOfMeans)

    const courtOrderAmount: number = DeterminationOfMeansCalculations.calculateCourtOrderAmount(
      defendantMonthlyInstalmentAmount, 
      claimantMonthlyInstalmentAmount, 
      defendantMonthlyDisposableIncome
    )

    logger.info(`Court redetermination amount: ${courtOrderAmount}, `
     + `based on Defendant monthly instalment amount: ${defendantMonthlyInstalmentAmount}, `
     + `Defendant disposable amount: ${defendantMonthlyDisposableIncome}, `
     + `Claimant monthly instalment amount: ${claimantMonthlyInstalmentAmount}`)

    const externalId: string = req.params.externalId

    if (courtOrderAmount == claimantMonthlyInstalmentAmount) {
      return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
    } else {
      return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentPlanPage()
  .buildRouter(claimantResponsePath, (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  })
