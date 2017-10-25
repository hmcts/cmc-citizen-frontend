import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import DateOfBirth from 'forms/models/dateOfBirth'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.claimantDateOfBirthPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.claimant.partyDetails.dateOfBirth), res)
  })
  .post(
    Paths.claimantDateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.document.claimant.partyDetails.dateOfBirth = form.model

        await new DraftService().save(res.locals.user.claimDraft, res.locals.user.bearerToken)

        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
