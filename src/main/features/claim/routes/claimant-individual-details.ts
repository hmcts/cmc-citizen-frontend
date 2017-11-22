import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { IndividualDetails } from 'forms/models/individualDetails'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'

function renderView (form: Form<IndividualDetails>, res: express.Response): void {
  res.render(Paths.claimantIndividualDetailsPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantIndividualDetailsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: DraftClaim = res.locals.user.claimDraft.document

    renderView(new Form(draft.claimant.partyDetails as IndividualDetails), res)
  })
  .post(
    Paths.claimantIndividualDetailsPage.uri,
    FormValidator.requestHandler(IndividualDetails, IndividualDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<IndividualDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        // Workaround: reset date of birth which is erased in the process of form deserialization
        form.model.dateOfBirth = (user.claimDraft.document.claimant.partyDetails as IndividualDetails).dateOfBirth
        user.claimDraft.document.claimant.partyDetails = form.model
        await new DraftService().save(user.claimDraft, user.bearerToken)

        res.redirect(Paths.claimantDateOfBirthPage.uri)
      }
    }))
