import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Reason } from 'claim/form/models/reason'

import { ErrorHandling } from 'common/errorHandling'
import { User } from 'app/idam/user'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'

function renderView (form: Form<Reason>, res: express.Response): void {
  const draft = res.locals.draft.document
  const defendantName = (
    draft.defendant
    && draft.defendant.partyDetails
    && draft.defendant.partyDetails.name)
    ? draft.defendant.partyDetails.name : ''

  res.render(Paths.reasonPage.associatedView, { form: form, defendantName: defendantName })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.reasonPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: DraftClaim = res.locals.draft.document

    renderView(new Form(draft.reason), res)
  })
  .post(
    Paths.reasonPage.uri,
    FormValidator.requestHandler(Reason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Reason> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        draft.document.reason = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.uri)
      }
    }))
