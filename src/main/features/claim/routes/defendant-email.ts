import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import Email from 'forms/models/email'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<Email>, res: express.Response): void {
  res.render(Paths.defendantEmailPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantEmailPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.email), res)
  })
  .post(
    Paths.defendantEmailPage.uri,
    FormValidator.requestHandler(Email),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Email> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.defendant.email = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.taskListPage.uri)
      }
    }))
