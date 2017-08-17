import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { IndividualDetails } from 'forms/models/individualDetails'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<IndividualDetails>, res: express.Response): void {
  res.render(Paths.claimantIndividualDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantIndividualDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.partyDetails as IndividualDetails), res)
  })
  .post(
    Paths.claimantIndividualDetailsPage.uri,
    FormValidator.requestHandler(IndividualDetails, IndividualDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<IndividualDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        (res.locals.user.claimDraft.claimant.partyDetails as IndividualDetails) = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimantDateOfBirthPage.uri)
      }
    }))
