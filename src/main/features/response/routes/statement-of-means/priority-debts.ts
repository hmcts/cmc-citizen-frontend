import * as express from 'express'
import { StatementOfMeansPaths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { Validator } from '@hmcts/class-validator'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'
import { PriorityDebt } from 'response/form/models/statement-of-means/priorityDebt'
import { ExpenseSource } from 'response/form/models/statement-of-means/expenseSource'

const page: RoutablePath = StatementOfMeansPaths.priorityDebtsPage

function renderView (form: Form<PriorityDebt>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    totalMonthlyIncomeExpense: calculateTotalMonthlyIncomeExpense(form.model)
  })
}

function calculateTotalMonthlyIncomeExpense (model: PriorityDebt): number {
  if (!model) {
    return undefined
  }
  const incomeExpenseSources = IncomeExpenseSources.fromPriorityDebtModel(model)

  if (!isValid(incomeExpenseSources)) {
    return undefined
  }

  return CalculateMonthlyIncomeExpense.calculateTotalAmount(
    incomeExpenseSources.incomeExpenseSources
  )
}

function isValid (incomeExpenseSources: IncomeExpenseSources): boolean {
  const validator = new Validator()
  return validator.validateSync(incomeExpenseSources).length === 0
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  function extractPropertyName (action: object): string {
    return Object.keys(action)[0]
  }

  if (req.body.action) {

    const actionName = extractPropertyName(req.body.action)
    const form: Form<PriorityDebt> = req.body

    switch (actionName) {
      case 'resetDebt':
        const propertyName = extractPropertyName(req.body.action[actionName])
        const selectedForReset: ExpenseSource = form.valueFor(propertyName)
        form.model.resetIncome(propertyName, selectedForReset)
        break
    }

    return renderView(form, res)
  }
  next()
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.priorityDebt), res)
    }))
  .post(
    page.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(
      PriorityDebt, PriorityDebt.fromObject, undefined, ['resetDebt']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<PriorityDebt> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.priorityDebt = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.debtsPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
