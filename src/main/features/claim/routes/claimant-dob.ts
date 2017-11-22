import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DateOfBirth } from 'forms/models/dateOfBirth'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { IndividualDetails } from 'forms/models/individualDetails'
import { User } from 'idam/user'

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.claimantDateOfBirthPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    const draft: DraftClaim = res.locals.user.claimDraft.document

    renderView(new Form((draft.claimant.partyDetails as IndividualDetails).dateOfBirth), res)
  })
  .post(
    Paths.claimantDateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user;

        (user.claimDraft.document.claimant.partyDetails as IndividualDetails).dateOfBirth = form.model
        await new DraftService().save(user.claimDraft, user.bearerToken)

        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
