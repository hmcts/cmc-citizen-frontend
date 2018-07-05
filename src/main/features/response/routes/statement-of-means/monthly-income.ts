import * as express from 'express'
import { StatementOfMeansPaths } from 'response/paths'

import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { MonthlyIncomeSource } from 'response/form/models/statement-of-means/monthlyIncomeSource'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { Validator } from 'class-validator'

const page: RoutablePath = StatementOfMeansPaths.monthlyIncomePage

function renderView (form: Form<MonthlyIncome>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    totalMonthlyIncomeExpense: calculateTotalMonthlyIncomeExpense(form.model)
  })
}

function calculateTotalMonthlyIncomeExpense (model: MonthlyIncome): number {
  if (!model) {
    return undefined
  }
  const incomeExpenseSources = IncomeExpenseSources.fromFormModel(model)

  if (!isValid(incomeExpenseSources)) {
    return undefined
  }

  return CalculateMonthlyIncomeExpense.calculateTotalAmount(
    incomeExpenseSources.incomeExpenseSources
  )
}

function isValid (incomeExpenseSources: IncomeExpenseSources): boolean {
  const validator = new Validator()
  const errors = validator.validateSync(incomeExpenseSources)
  return errors.length < 1
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  function extractPropertyName (action: object): string {
    return Object.keys(action)[0]
  }

  if (req.body.action) {
    const actionName = extractPropertyName(req.body.action)
    const form: Form<MonthlyIncome> = req.body

    switch (actionName) {
      case 'addOtherIncomeSource':
        form.model.addEmptyOtherIncome()
        break
      case 'removeOtherIncomeSource':
        const selectedForRemoval: MonthlyIncomeSource = form.valueFor(extractPropertyName(req.body.action[actionName]))
        form.model.removeOtherIncome(selectedForRemoval)
        break
      case 'resetIncomeSource':
        const selectedForReset: MonthlyIncomeSource = form.valueFor(extractPropertyName(req.body.action[actionName]))
        selectedForReset.reset()
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
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    StatementOfMeansStateGuard.requestHandler(),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.monthlyIncome), res)
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(MonthlyIncome, MonthlyIncome.fromObject, undefined, ['addOtherIncomeSource', 'removeOtherIncomeSource', 'resetIncomeSource']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<MonthlyIncome> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.monthlyIncome = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.monthlyExpensesPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
