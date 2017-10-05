import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<SoleTraderDetails>, res: express.Response): void {
  res.render(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.defendant.partyDetails as SoleTraderDetails), res)
  })
  .post(
    Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri,
    FormValidator.requestHandler(SoleTraderDetails, SoleTraderDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SoleTraderDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        (res.locals.user.claimDraft.document.defendant.partyDetails as SoleTraderDetails) = form.model
        await DraftService.save(res.locals.user.claimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
