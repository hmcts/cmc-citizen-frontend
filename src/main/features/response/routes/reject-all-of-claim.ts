import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { RejectAllOfClaim } from 'response/form/models/rejectAllOfClaim'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'

function renderView (form: Form<RejectAllOfClaim>, res: express.Response) {
  res.render(Paths.defenceRejectAllOfClaimPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defenceRejectAllOfClaimPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.responseDraft.rejectAllOfClaim), res)
  }))
  .post(
    Paths.defenceRejectAllOfClaimPage.uri,
    FormValidator.requestHandler(RejectAllOfClaim),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { externalId } = req.params
      const form: Form<RejectAllOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.rejectAllOfClaim = form.model
        await ResponseDraftMiddleware.save(res, next)
        if (user.responseDraft.rejectAllOfClaim.option === 'dispute') {
          res.redirect(Paths.defencePage.evaluateUri({ externalId: externalId }))
        }
        if (user.responseDraft.rejectAllOfClaim.option === 'counterClaim') {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
        if (user.responseDraft.rejectAllOfClaim.option === 'paid') {
          res.redirect(Paths.freeMediationPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
