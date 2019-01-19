import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Form } from 'main/app/forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'main/app/idam/user'
import { DraftMediation } from 'mediation/draft/draftMediation'
import { FreeMediation, FreeMediationOption } from 'main/app/forms/models/freeMediation'

function renderView (form: Form<FreeMediation>, res: express.Response) {
  res.render(Paths.willYouTryMediation.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.willYouTryMediation.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftMediation> = res.locals.mediationDraft

      renderView(new Form(draft.document.willYouTryMediation), res)
    }
  )
  .post(
    Paths.willYouTryMediation.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FreeMediation> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftMediation> = res.locals.mediationDraft
        const user: User = res.locals.user

        draft.document.willYouTryMediation = form.model

        switch (form.model.option) {
          case FreeMediationOption.NO:
            // TODO: Delete draft information from next pages
            break
        }
        await new DraftService().save(draft, user.bearerToken)

        const externalId: string = req.params.externalId
        // TODO: redirect to next page when they are ready
        if (form.model.option === FreeMediationOption.YES) {
          res.redirect(Paths.willYouTryMediation.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.willYouTryMediation.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
