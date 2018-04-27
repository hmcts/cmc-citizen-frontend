import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PartyTypeResponse } from 'forms/models/partyTypeResponse'
import { PartyType } from 'common/partyType'
import { ErrorHandling } from 'shared/errorHandling'
import { PartyDetails } from 'forms/models/partyDetails'
import { PartyDetailsFactory } from 'forms/models/partyDetailsFactory'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<PartyTypeResponse>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.claimantPartyTypeSelectionPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantPartyTypeSelectionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(new PartyTypeResponse(draft.document.claimant.partyDetails ? PartyType.valueOf(draft.document.claimant.partyDetails.type) : undefined)), res, next)
  })
  .post(
    Paths.claimantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user
        let partyDetails: PartyDetails = draft.document.claimant.partyDetails

        if (partyDetails === undefined || partyDetails.type !== form.model.type.value) {
          partyDetails = draft.document.claimant.partyDetails = PartyDetailsFactory.createInstance(form.model.type.value)
          await new DraftService().save(draft, user.bearerToken)
        }

        switch (partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.claimantIndividualDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            res.redirect(Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.COMPANY.value:
            res.redirect(Paths.claimantCompanyDetailsPage.uri)
            break
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.claimantOrganisationDetailsPage.uri)
            break
        }
      }
    }))
