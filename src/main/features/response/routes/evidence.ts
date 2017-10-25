import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Evidence } from 'response/form/models/evidence'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<Evidence>, res: express.Response): void {
  res.render(Paths.evidencePage.associatedView, {
    form: form,
    claimantName: res.locals.user.claim.claimData.claimant.name,
    canAddMoreEvidence: form.model.canAddMoreRows()
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<Evidence> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
    }
    return renderView(form, res)
  }
  next()
}

export default express.Router()
  .get(Paths.evidencePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.responseDraft.document.evidence), res)
  })
  .post(
    Paths.evidencePage.uri,
    FormValidator.requestHandler(Evidence, Evidence.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Evidence> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        res.locals.user.responseDraft.document.evidence = form.model

        await DraftService.save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.user.claim.externalId }))
      }
    })
  )
