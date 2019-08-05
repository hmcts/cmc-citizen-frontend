import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseType } from 'response/form/models/responseType'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
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
    && draft.document.response.type === ResponseType.DEFENCE
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim

  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }))
}

const guardRequestHandler: express.RequestHandler = GuardFactory.create(isRequestAllowed, accessDeniedCallback)

function renderView (form: Form<RejectAllOfClaim>, res: express.Response) {
  const claim: Claim = res.locals.claim

  res.render(Paths.defenceRejectAllOfClaimPage.associatedView, {
    form: form,
    claimantName: claim.claimData.claimant.name
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defenceRejectAllOfClaimPage.uri,
    guardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      renderView(new Form(draft.document.rejectAllOfClaim), res)
    }))
  .post(
    Paths.defenceRejectAllOfClaimPage.uri,
    guardRequestHandler,
    FormValidator.requestHandler(RejectAllOfClaim),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<RejectAllOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.rejectAllOfClaim = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        switch (draft.document.rejectAllOfClaim.option) {
          case RejectAllOfClaimOption.COUNTER_CLAIM:
            res.redirect(Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }))
            break
          case RejectAllOfClaimOption.ALREADY_PAID:
          case RejectAllOfClaimOption.DISPUTE:
            res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
            break
          default:
            throw new Error(`Unknown rejection option: ${draft.document.rejectAllOfClaim.option}`)
        }
      }
    }))
