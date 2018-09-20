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
import { PaymentDeadlineHelper } from 'shared/helpers/paymentDeadlineHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { AdmissionHelper } from 'shared/helpers/admissionHelper'

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
    const paymentDateProposedByDefendant: Moment = PaymentDeadlineHelper.getPaymentDeadlineFromAdmission(locals.claim)
    const paymentIntentionFromClaimant: PaymentIntention = locals.draft.document.alternatePaymentMethod.toDomainInstance()
    const paymentDateDeterminedFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromFinancialStatement(locals.claim)

    locals.draft.document.courtOfferedPaymentIntention = CourtDetermination.determinePaymentIntention(AdmissionHelper.getAdmittedAmount(locals.claim), paymentDateProposedByDefendant, paymentIntentionFromClaimant, paymentDateDeterminedFromDefendantFinancialStatement)
    locals.draft.document.acceptCourtOffer = undefined
    locals.draft.document.settlementAgreement = undefined
    locals.draft.document.formaliseRepaymentPlan = undefined

    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.draft

    const paymentDateProposedByDefendant: Moment = PaymentDeadlineHelper.getPaymentDeadlineFromAdmission(claim)
    const paymentDateProposedByClaimant: Moment = PaymentPlanHelper.createPaymentPlanFromForm(draft.document.alternatePaymentMethod.paymentPlan).calculateLastPaymentDate()
    const paymentDateDeterminedFromDefendantFinancialStatement: Moment = PaymentPlanHelper.createPaymentPlanFromFinancialStatement(claim).calculateLastPaymentDate()

    const externalId: string = req.params.externalId
    switch (CourtDetermination.determinePaymentDeadline(paymentDateProposedByDefendant, paymentDateProposedByClaimant, paymentDateDeterminedFromDefendantFinancialStatement).source) {
      case DecisionType.COURT:
      case DecisionType.DEFENDANT: {
        return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.CLAIMANT: {
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
