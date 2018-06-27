// import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule';
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
import { StatementOfMeans } from 'response/draft/statementOfMeans'

const page: RoutablePath = StatementOfMeansPaths.monthlyIncomePage

function renderView (form: Form<MonthlyIncome>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form
  })
}

// function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
//   if (req.body.action) {
//     const form: Form<MonthlyIncome> = req.body
//     if (req.body.action.addRow) {
//       // form.model.appendRow()
//     }
//     return renderView(form, res)
//   }
//   next()
// }

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    StatementOfMeansStateGuard.requestHandler(),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const statementOfMeans: StatementOfMeans = draft.document.statementOfMeans || new StatementOfMeans()
      renderView(new Form(statementOfMeans.monthlyIncome), res)
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(MonthlyIncome, normaliseFormData(MonthlyIncome.fromObject)),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
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

function normaliseFormData (fromObject) {
  return (value?: any): MonthlyIncome => fromObject(value).normalize()
}
