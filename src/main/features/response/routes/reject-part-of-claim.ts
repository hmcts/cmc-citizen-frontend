import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaim } from 'response/form/models/rejectPartOfClaim'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

function isRequestAllowed (res: express.Response): boolean {
  const draft: ResponseDraft = res.locals.user.responseDraft.document

  return draft.response !== undefined
    && draft.response.type === ResponseType.OWE_SOME_PAID_NONE
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.user.claim
  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }))
}

const guardRequestHandler: express.RequestHandler = GuardFactory.create(isRequestAllowed, accessDeniedCallback)

function renderView (form: Form<RejectPartOfClaim>, res: express.Response) {
  res.render(Paths.defenceRejectPartOfClaimPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defenceRejectPartOfClaimPage.uri,
    guardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: ResponseDraft = res.locals.user.responseDraft.document

      renderView(new Form(draft.rejectPartOfClaim), res)
    }))
  .post(
    Paths.defenceRejectPartOfClaimPage.uri,
    guardRequestHandler,
    FormValidator.requestHandler(RejectPartOfClaim),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<RejectPartOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        user.responseDraft.document.rejectPartOfClaim = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
