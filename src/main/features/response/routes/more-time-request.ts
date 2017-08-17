import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import MoreTimeAlreadyRequestedGuard from 'response/guards/moreTimeAlreadyRequestedGuard'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<MoreTimeNeeded>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.moreTimeRequestPage.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(
    Paths.moreTimeRequestPage.uri,
    MoreTimeAlreadyRequestedGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(res.locals.user.responseDraft.moreTimeNeeded), res, next)
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
        res.locals.user.responseDraft.moreTimeNeeded = form.model
        await ResponseDraftMiddleware.save(res, next)
        if (form.model.option === MoreTimeNeededOption.YES) {
          const claim: Claim = await ClaimStoreClient.retrieveByDefendantId(res.locals.user.id)
          await ClaimStoreClient.requestForMoreTime(claim.id, res.locals.user)

          res.redirect(Paths.moreTimeConfirmationPage.uri)
        } else {
          res.redirect(Paths.taskListPage.uri)
        }
      }
    }))
