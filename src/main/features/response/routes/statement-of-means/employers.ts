import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { Employers } from 'response/form/models/employers'

function renderView (form: Form<Employers>, res: express.Response): void {
  res.render(StatementOfMeansPaths.employersPage.associatedView, {
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
  .get(StatementOfMeansPaths.employersPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.responseDraft.document.employers), res)
  })
  .post(
    StatementOfMeansPaths.employersPage.uri,
    FormValidator.requestHandler(Employers, Employers.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Employers> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        res.locals.user.responseDraft.document.employers = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        res.redirect(StatementOfMeansPaths.employersPage.evaluateUri({ externalId: res.locals.user.claim.externalId }))
      }
    })
  )
