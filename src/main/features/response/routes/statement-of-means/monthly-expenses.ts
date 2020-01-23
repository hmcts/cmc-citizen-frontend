import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { Validator } from '@hmcts/class-validator'
import { ExpenseSource } from 'response/form/models/statement-of-means/expenseSource'

const page: RoutablePath = StatementOfMeansPaths.monthlyExpensesPage

function renderView (form: Form<MonthlyExpenses>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    totalMonthlyExpense: calculateTotalMonthlyIncomeExpense(form.model)
  })
}

function calculateTotalMonthlyIncomeExpense (model: MonthlyExpenses): number {
  if (!model) {
    return undefined
  }
  const incomeExpenseSources = IncomeExpenseSources.fromMonthlyExpensesFormModel(model)

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
    const form: Form<MonthlyExpenses> = req.body

    switch (actionName) {
      case 'addOther':
        form.model.addEmptyOtherExpense()
        break
      case 'removeOther':
        const selectedForRemoval: ExpenseSource = form.valueFor(extractPropertyName(req.body.action[actionName]))
        form.model.removeOtherExpense(selectedForRemoval)
        break
      case 'reset':
        const propertyName = extractPropertyName(req.body.action[actionName])
        const selectedForReset: ExpenseSource = form.valueFor(propertyName)
        form.model.resetExpense(propertyName, selectedForReset)
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
    StatementOfMeansStateGuard.requestHandler(),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.monthlyExpenses), res)
    }))
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(MonthlyExpenses, MonthlyExpenses.fromObject, undefined, ['addOther', 'removeOther', 'reset']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<MonthlyExpenses> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.monthlyExpenses = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.monthlyIncomePage.evaluateUri({ externalId: externalId }))
      }
    })
  )
