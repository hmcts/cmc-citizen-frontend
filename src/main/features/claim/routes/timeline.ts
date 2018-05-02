import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

const page: RoutablePath = Paths.timelinePage

function renderView (form: Form<ClaimantTimeline>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<ClaimantTimeline> = req.body
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
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      renderView(new Form(draft.document.timeline), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(ClaimantTimeline, ClaimantTimeline.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ClaimantTimeline> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        draft.document.timeline = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.evidencePage.uri)
      }
    })
  )
