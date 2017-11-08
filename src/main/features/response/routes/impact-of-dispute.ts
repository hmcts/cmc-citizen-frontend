import * as express from 'express'

import { Paths } from 'features/response/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ImpactOfDispute } from 'response/form/models/impactOfDispute'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<ImpactOfDispute>, res: express.Response): void {
  const claim: Claim = res.locals.user.claim
  res.render(Paths.impactOfDisputePage.associatedView, {
    form: form,
    claimantName: claim.claimData.claimant.name
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.impactOfDisputePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.impactOfDispute), res)
    }))
  .post(Paths.impactOfDisputePage.uri,
    FormValidator.requestHandler(ImpactOfDispute),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<ImpactOfDispute> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.responseDraft.document.impactOfDispute = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
