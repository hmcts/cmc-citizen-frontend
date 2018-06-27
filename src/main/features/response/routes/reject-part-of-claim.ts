import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaim } from 'response/form/models/rejectPartOfClaim'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'

function isRequestAllowed (res: express.Response): boolean {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  return draft.document.response !== undefined
    && draft.document.response.type === ResponseType.PART_ADMISSION
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
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
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      console.log(draft.document.rejectPartOfClaim)

      renderView(new Form(draft.document.rejectPartOfClaim), res)
    }))
  .post(
    Paths.defenceRejectPartOfClaimPage.uri,
    guardRequestHandler,
    FormValidator.requestHandler(RejectPartOfClaim, RejectPartOfClaim.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<RejectPartOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.rejectPartOfClaim = form.model
        draft.document.fullAdmission = draft.document.rejectAllOfClaim = undefined

        await new DraftService().save(draft, user.bearerToken)

        console.log(form)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
