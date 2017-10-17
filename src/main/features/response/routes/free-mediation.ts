import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { FreeMediation } from 'response/form/models/freeMediation'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { DraftService } from 'services/DraftService'


async function renderView (form: Form<FreeMediation>, res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    res.render(Paths.freeMediationPage.associatedView, {
      form: form,
      claimantFullName: user.claim.claimData.claimant.name
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.freeMediationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.responseDraft.document.freeMediation), res, next)
  })
  .post(
    Paths.freeMediationPage.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<FreeMediation> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const user = res.locals.user
        user.responseDraft.document.freeMediation = form.model
        await new DraftService()['save'](user.responseDraft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
