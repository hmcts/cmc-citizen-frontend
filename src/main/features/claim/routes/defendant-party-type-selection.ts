import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PartyTypeResponse } from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { ErrorHandling } from 'common/errorHandling'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyDetailsFactory } from 'forms/models/partyDetailsFactory'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<PartyTypeResponse>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.defendantPartyTypeSelectionPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantPartyTypeSelectionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const partyDetails: PartyDetails = res.locals.user.claimDraft.defendant.partyDetails
    renderView(new Form(new PartyTypeResponse(partyDetails ? PartyType.valueOf(partyDetails.type) : undefined)), res, next)
  })
  .post(
    Paths.defendantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        let partyDetails: PartyDetails = res.locals.user.claimDraft.defendant.partyDetails

        if (partyDetails === undefined || partyDetails.type !== form.model.type.value) {
          partyDetails = res.locals.user.claimDraft.defendant.partyDetails = PartyDetailsFactory.createInstance(form.model.type.value)
          await ClaimDraftMiddleware.save(res, next)
        }

        switch (partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.defendantIndividualDetailsPage.uri)
            break
          case PartyType.COMPANY.value:
            res.redirect(Paths.defendantCompanyDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            res.redirect(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.defendantOrganisationDetailsPage.uri)
            break
        }
      }
    }))
