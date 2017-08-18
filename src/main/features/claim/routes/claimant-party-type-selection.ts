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
        switch (form.model.type) {
          case PartyType.INDIVIDUAL:
            res.redirect(Paths.claimantIndividualDetailsPage.uri)
            break
          case PartyType.COMPANY:
            res.redirect(Paths.claimantCompanyDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED:
            res.redirect(Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.ORGANISATION:
            res.redirect(Paths.claimantOrganisationDetailsPage.uri)
            break
          default:
            throw Error('Something went wrong, No claimant type is set')
        }
      }
    }))
