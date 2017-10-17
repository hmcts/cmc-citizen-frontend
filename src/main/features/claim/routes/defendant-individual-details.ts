import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { IndividualDetails } from 'forms/models/individualDetails'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/DraftService'


function renderView (form: Form<IndividualDetails>, res: express.Response): void {
  res.render(Paths.defendantIndividualDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantIndividualDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.defendant.partyDetails as IndividualDetails), res)
  })
  .post(
    Paths.defendantIndividualDetailsPage.uri,
    FormValidator.requestHandler(IndividualDetails, IndividualDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<IndividualDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        (res.locals.user.claimDraft.document.defendant.partyDetails as IndividualDetails) = form.model

        await new DraftService()['save'](res.locals.user.claimDraft, res.locals.user.bearerToken)

        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
