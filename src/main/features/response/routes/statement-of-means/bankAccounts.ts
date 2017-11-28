import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'
import { BankAccounts } from 'response/form/models/statement-of-means/bankAccounts'

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
  .get(page.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: User = res.locals.user
    renderView(new Form(user.responseDraft.document.statementOfMeans.bankAccounts), res)
  })
  .post(
    page.uri,
    FormValidator.requestHandler(BankAccounts, BankAccounts.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<BankAccounts> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        user.responseDraft.document.statementOfMeans.bankAccounts = form.model

        await new DraftService().save(user.responseDraft, user.bearerToken)

        renderView(form, res)
      }
    })
  )
