import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Email } from 'forms/models/email'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'

function renderView (form: Form<Email>, res: express.Response): void {
  res.render(Paths.defendantEmailPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantEmailPage.uri, (req: express.Request, res: express.Response) => {
    const draft: DraftClaim = res.locals.user.claimDraft.document

    renderView(new Form(draft.defendant.email), res)
  })
  .post(
    Paths.defendantEmailPage.uri,
    FormValidator.requestHandler(Email),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Email> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        user.claimDraft.document.defendant.email = form.model
        await new DraftService().save(user.claimDraft, user.bearerToken)

        res.redirect(Paths.taskListPage.uri)
      }
    }))
