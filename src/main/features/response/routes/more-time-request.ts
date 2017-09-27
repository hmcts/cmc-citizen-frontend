import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import MoreTimeAlreadyRequestedGuard from 'response/guards/moreTimeAlreadyRequestedGuard'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'

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
        const user: User = res.locals.user
        user.responseDraft.moreTimeNeeded = form.model
        await ResponseDraftMiddleware.save(res, next)
        if (form.model.option === MoreTimeNeededOption.YES) {
          await ClaimStoreClient.requestForMoreTime(user.claim.id, user)

          res.redirect(Paths.moreTimeConfirmationPage.evaluateUri({ externalId: user.claim.externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
        }
      }
    }))
