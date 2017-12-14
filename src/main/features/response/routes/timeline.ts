import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'

import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'
import { Timeline } from 'response/form/models/timeline'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

const page: RoutablePath = Paths.timelinePage

function renderView (form: Form<Timeline>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    claimantName: res.locals.claim.claimData.claimant.name
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
  .get(
    page.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.timeline), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(Timeline, Timeline.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Timeline> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        draft.document.timeline = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.evidencePage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
