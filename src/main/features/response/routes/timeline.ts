import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { TimelineBreakdown } from 'response/form/models/timelineBreakdown'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<TimelineBreakdown>, res: express.Response): void {
  res.render(Paths.timelinePage.associatedView, { form: form, claimantName: res.locals.user.claim.claimData.claimant.name })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<TimelineBreakdown> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
    }
    return renderView(form, res)
  }
  next()
}

export default express.Router()
  .get(Paths.timelinePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.responseDraft.document.timeline), res)
  })
  .post(
    Paths.timelinePage.uri,
    FormValidator.requestHandler(TimelineBreakdown, TimelineBreakdown.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<TimelineBreakdown> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.responseDraft.document.timeline = form.model

        await DraftService.save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        renderView(form, res)
      }
    })
  )
