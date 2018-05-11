import * as express from 'express'

import { Paths } from 'features/response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ImpactOfDispute } from 'response/form/models/impactOfDispute'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

function renderView (form: Form<ImpactOfDispute>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  res.render(Paths.impactOfDisputePage.associatedView, {
    form: form,
    claimantName: claim.claimData.claimant.name
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.impactOfDisputePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.impactOfDispute), res)
    }))
  .post(Paths.impactOfDisputePage.uri,
    FormValidator.requestHandler(ImpactOfDispute),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<ImpactOfDispute> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.impactOfDispute = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
