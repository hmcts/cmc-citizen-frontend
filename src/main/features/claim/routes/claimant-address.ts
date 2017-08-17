import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { PartyDetails } from 'forms/models/partyDetails'

function renderView (form: Form<PartyDetails>, res: express.Response): void {
  res.render(Paths.claimantAddressPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.partyDetails), res)
  })
  .post(
    Paths.claimantAddressPage.uri,
    FormValidator.requestHandler(PartyDetails, PartyDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.claimant.partyDetails = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
