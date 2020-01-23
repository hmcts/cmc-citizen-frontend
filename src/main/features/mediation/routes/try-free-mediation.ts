import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Form } from 'main/app/forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'main/app/idam/user'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation } from 'main/app/forms/models/freeMediation'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<FreeMediation>, res: express.Response) {
  res.render(Paths.tryFreeMediationPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.tryFreeMediationPage.uri,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<MediationDraft> = res.locals.mediationDraft

      renderView(new Form(draft.document.willYouTryMediation), res)
    }
  )
  .post(
    Paths.tryFreeMediationPage.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FreeMediation> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        draft.document.willYouTryMediation = form.model

        await new DraftService().save(draft, user.bearerToken)

        const externalId: string = req.params.externalId
        const claim: Claim = res.locals.claim
        if (!claim.isResponseSubmitted()) {
          res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
