import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Interest, InterestType } from 'claim/form/models/interest'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'

function renderView (form: Form<Interest>, res: express.Response): void {
  res.render(Paths.interestPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: DraftClaim = res.locals.user.claimDraft.document

    renderView(new Form(draft.interest), res)
  })
  .post(
    Paths.interestPage.uri,
    FormValidator.requestHandler(Interest, Interest.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Interest> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        user.claimDraft.document.interest = form.model
        await new DraftService().save(user.claimDraft, user.bearerToken)

        if (form.model.type === InterestType.NO_INTEREST) {
          res.redirect(Paths.feesPage.uri)
        } else {
          res.redirect(Paths.interestDatePage.uri)
        }
      }
    }))
