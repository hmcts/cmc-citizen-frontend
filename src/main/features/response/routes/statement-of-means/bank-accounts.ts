import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = StatementOfMeansPaths.bankAccountsPage

function renderView (form: Form<BankAccounts>, res: express.Response): void {
  res.render(page.associatedView, { form: form })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<BankAccounts> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
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
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.bankAccounts), res)
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(BankAccounts, BankAccounts.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<BankAccounts> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft

        form.model.removeExcessRows()
        draft.document.statementOfMeans.bankAccounts = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.debtsPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
