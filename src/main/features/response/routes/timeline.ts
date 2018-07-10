import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'

import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'

const page: RoutablePath = Paths.timelinePage

function renderView (form: Form<DefendantTimeline>, res: express.Response): void {
  const claim: Claim = res.locals.claim

  res.render(page.associatedView, {
    form: form,
    timeline: claim.claimData.timeline
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<DefendantTimeline> = req.body
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
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      let timeline

      if (draft.document.isResponsePartiallyAdmitted()) {
        timeline = draft.document.partialAdmission.timeline
      } else {
        timeline = draft.document.timeline
      }

      renderView(new Form(timeline), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(DefendantTimeline, DefendantTimeline.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantTimeline> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        if (draft.document.isResponseRejected()) {
          draft.document.timeline = form.model
        } else {
          draft.document.partialAdmission.timeline = form.model
        }
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.evidencePage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
