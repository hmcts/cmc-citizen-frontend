import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { IndividualDetails } from 'forms/models/individualDetails'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'

function renderView (form: Form<IndividualDetails>, res: express.Response): void {
  res.render(Paths.claimantIndividualDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantIndividualDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.claimant.partyDetails as IndividualDetails), res)
  })
  .post(
    Paths.claimantIndividualDetailsPage.uri,
    FormValidator.requestHandler(IndividualDetails, IndividualDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<IndividualDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        // Workaround: reset date of birth which is erased in the process of form deserialization
        form.model.dateOfBirth = (res.locals.user.claimDraft.document.claimant.partyDetails as IndividualDetails).dateOfBirth
        res.locals.user.claimDraft.document.claimant.partyDetails = form.model

        await new DraftService().save(res.locals.user.claimDraft, res.locals.user.bearerToken)

        res.redirect(Paths.claimantDateOfBirthPage.uri)
      }
    }))
