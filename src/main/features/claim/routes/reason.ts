import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import Reason from 'forms/models/reason'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import User from 'app/idam/user'

function renderView (form: Form<Reason>, res: express.Response): void {
  const user: User = res.locals.user
  const defendantName = user.claimDraft.defendant.partyDetails.name ? user.claimDraft.defendant.partyDetails.name : ''

  res.render(Paths.reasonPage.associatedView, { form: form, defendantName: defendantName })
}

export default express.Router()
  .get(Paths.reasonPage.uri, (req: express.Request, res: express.Response): void => {
    renderView(new Form(res.locals.user.claimDraft.reason), res)
  })
  .post(
    Paths.reasonPage.uri,
    FormValidator.requestHandler(Reason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Reason> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.reason = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.taskListPage.uri)
      }
    }))
