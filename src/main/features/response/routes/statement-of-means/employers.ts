import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'

const page: RoutablePath = StatementOfMeansPaths.employersPage

function renderView (form: Form<Employers>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    canAddMoreJobs: form.model.canAddMoreRows()
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<Employers> = req.body
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
    renderView(new Form(user.responseDraft.document.statementOfMeans.employers), res)
  })
  .post(
    page.uri,
    FormValidator.requestHandler(Employers, Employers.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Employers> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        user.responseDraft.document.statementOfMeans.employers = form.model

        await new DraftService().save(user.responseDraft, user.bearerToken)

        if (user.responseDraft.document.statementOfMeans.employment.selfEmployed) {
          res.redirect(StatementOfMeansPaths.selfEmployedPage.evaluateUri({ externalId: externalId }))
        } else {
          // TODO: when ROC-2559 is delivered this should redirect to the next page
          renderView(form, res)
        }

      }
    })
  )
