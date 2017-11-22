import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaim } from 'response/form/models/rejectAllOfClaim'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

function isRequestAllowed (res: express.Response): boolean {
  const draft: ResponseDraft = res.locals.user.responseDraft.document

  return draft.response !== undefined
    && draft.response.type === ResponseType.OWE_NONE
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.user.claim

  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }))
}

const guardRequestHandler: express.RequestHandler = GuardFactory.create(isRequestAllowed, accessDeniedCallback)

function renderView (form: Form<RejectAllOfClaim>, res: express.Response) {
  res.render(Paths.defenceRejectAllOfClaimPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defenceRejectAllOfClaimPage.uri,
    guardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: ResponseDraft = res.locals.user.responseDraft.document

      renderView(new Form(draft.rejectAllOfClaim), res)
    }))
  .post(
    Paths.defenceRejectAllOfClaimPage.uri,
    guardRequestHandler,
    FormValidator.requestHandler(RejectAllOfClaim),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<RejectAllOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        user.responseDraft.document.rejectAllOfClaim = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
