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
    res.render(Paths.defendantPartyTypeSelectionPage.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.defendantPartyTypeSelectionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.partyTypeResponse), res, next)
  })
  .post(
    Paths.defendantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        res.locals.user.claimDraft.defendant.partyTypeResponse = form.model
        await ClaimDraftMiddleware.save(res, next)
        switch (form.model.type) {
          case PartyType.INDIVIDUAL:
            res.redirect(Paths.defendantIndividualDetailsPage.uri)
            break
          case PartyType.COMPANY:
            res.redirect(Paths.defendantCompanyDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED:
            res.redirect(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.ORGANISATION:
            res.redirect(Paths.defendantOrganisationDetailsPage.uri)
            break
          default:
            throw Error('Something went wrong, No defendant type is set')
        }
      }
    }))
