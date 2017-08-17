import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { ErrorHandling } from 'common/errorHandling'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<PartyTypeResponse>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.claimantPartyTypeSelectionPage.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.claimantPartyTypeSelectionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.partyTypeResponse), res, next)
  })
  .post(
    Paths.claimantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        res.locals.user.claimDraft.claimant.partyTypeResponse = form.model
        await ClaimDraftMiddleware.save(res, next)
        if (PartyType.INDIVIDUAL === form.model.type) {
          res.redirect(Paths.claimantIndividualDetailsPage.uri)
        } else if (PartyType.SOLE_TRADER_OR_SELF_EMPLOYED === form.model.type) {
          res.redirect(Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri)
        } else if (PartyType.COMPANY === form.model.type) {
          res.redirect(Paths.claimantCompanyDetailsPage.uri)
        } else if (PartyType.ORGANISATION === form.model.type) {
          res.redirect(Paths.claimantOrganisationDetailsPage.uri)
        } else {
          throw new Error()
        }
      }
    }))
