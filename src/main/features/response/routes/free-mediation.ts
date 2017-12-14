import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { FreeMediation } from 'response/form/models/freeMediation'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

async function renderView (form: Form<FreeMediation>, res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    res.render(Paths.freeMediationPage.associatedView, {
      form: form,
      claimantFullName: user.claim.claimData.claimant.name
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.freeMediationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: ResponseDraft = res.locals.draft.document

    await renderView(new Form(draft.freeMediation), res, next)
  })
  .post(
    Paths.freeMediationPage.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FreeMediation> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.freeMediation = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
