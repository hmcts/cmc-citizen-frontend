import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { RejectPartOfClaim } from 'response/form/models/rejectPartOfClaim'
import { DraftService } from 'common/draft/draftService'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'

function renderView (form: Form<RejectPartOfClaim>, res: express.Response) {
  res.render(Paths.defenceRejectPartOfClaimPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(
    Paths.defenceRejectPartOfClaimPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(res.locals.user.responseDraft.document.rejectPartOfClaim), res)
    }))
  .post(
    Paths.defenceRejectPartOfClaimPage.uri,
    FormValidator.requestHandler(RejectPartOfClaim),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { externalId } = req.params
      const form: Form<RejectPartOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.rejectPartOfClaim = form.model
        await DraftService.save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
