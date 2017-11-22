import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Timeline } from 'response/form/models/timeline'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { User } from 'idam/user'

function renderView (form: Form<Timeline>, res: express.Response): void {
  const claim: Claim = res.locals.user.claim

  res.render(Paths.timelinePage.associatedView, {
    form: form,
    claimantName: claim.claimData.claimant.name,
    canAddMoreEvents: form.model.canAddMoreRows()
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<Timeline> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
    }
    return renderView(form, res)
  }
  next()
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.timelinePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: ResponseDraft = res.locals.user.responseDraft.document

    renderView(new Form(draft.timeline), res)
  })
  .post(
    Paths.timelinePage.uri,
    FormValidator.requestHandler(Timeline, Timeline.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Timeline> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        const user: User = res.locals.user

        user.responseDraft.document.timeline = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        res.redirect(Paths.evidencePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
