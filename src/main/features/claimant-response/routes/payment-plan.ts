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
import { CourtOrder } from 'common/court-order/courtOrder'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

import { CourtOrderHelper } from 'shared/helpers/courtOrderHelper'

const logger = Logger.getLogger('features/claimant-response/routes/payment-plan')
class PaymentPlanPage extends AbstractPaymentPlanPage<DraftClaimantResponse> {
  getView (): string {
    return 'claimant-response/views/payment-plan'
  }

  getHeading (): string {
    return 'Suggest instalments for the defendant'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document

    const courtOrder: CourtOrder = CourtOrderHelper.createCourtOrder(claim, draft)
    const courtOrderAmount: number = courtOrder.calculateAmount()

    logger.info(`Court redetermination amount: ${courtOrderAmount}, `
      + `based on Defendant monthly instalment amount: ${courtOrder.defendantMonthlyInstalment}, `
      + `Defendant disposable amount: ${courtOrder.defendantMonthlyDisposableIncome}, `
      + `Claimant monthly instalment amount: ${courtOrder.claimantMonthlyInstalment}`)

    const externalId: string = req.params.externalId

    if (courtOrderAmount === courtOrder.claimantMonthlyInstalment) {
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
