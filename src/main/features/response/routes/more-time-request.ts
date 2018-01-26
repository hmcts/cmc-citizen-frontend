import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { ClaimStoreClient } from 'app/claims/claimStoreClient'
import { MoreTimeAlreadyRequestedGuard } from 'response/guards/moreTimeAlreadyRequestedGuard'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<MoreTimeNeeded>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.moreTimeRequestPage.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.moreTimeRequestPage.uri,
    MoreTimeAlreadyRequestedGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      renderView(new Form(draft.document.moreTimeNeeded), res, next)
    })
  .post(
    Paths.moreTimeRequestPage.uri,
    MoreTimeAlreadyRequestedGuard.requestHandler,
    FormValidator.requestHandler(MoreTimeNeeded),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<MoreTimeNeeded> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.moreTimeNeeded = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.option === MoreTimeNeededOption.YES) {
          await ClaimStoreClient.requestForMoreTime(claim.externalId, user)

          res.redirect(Paths.moreTimeConfirmationPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    }))
