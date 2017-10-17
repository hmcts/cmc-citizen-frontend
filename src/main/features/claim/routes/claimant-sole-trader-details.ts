import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/DraftService'


function renderView (form: Form<SoleTraderDetails>, res: express.Response): void {
  res.render(Paths.claimantSoleTraderOrSelfEmployedDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.claimant.partyDetails as SoleTraderDetails), res)
  })
  .post(
    Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri,
    FormValidator.requestHandler(SoleTraderDetails, SoleTraderDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SoleTraderDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.document.claimant.partyDetails = form.model

        await new DraftService()['save'](res.locals.user.claimDraft, res.locals.user.bearerToken)

        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
