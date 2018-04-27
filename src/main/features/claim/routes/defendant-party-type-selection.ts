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
  res.render(Paths.defendantPartyTypeSelectionPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantPartyTypeSelectionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(new PartyTypeResponse(draft.document.defendant.partyDetails ? PartyType.valueOf(draft.document.defendant.partyDetails.type) : undefined)), res, next)
  })
  .post(
    Paths.defendantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        let partyDetails: PartyDetails = draft.document.defendant.partyDetails
        if (partyDetails === undefined || partyDetails.type !== form.model.type.value) {
          partyDetails = draft.document.defendant.partyDetails = PartyDetailsFactory.createInstance(form.model.type.value)
          await new DraftService().save(draft, user.bearerToken)
        }

        switch (partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.defendantIndividualDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            res.redirect(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.COMPANY.value:
            res.redirect(Paths.defendantCompanyDetailsPage.uri)
            break
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.defendantOrganisationDetailsPage.uri)
            break
        }
      }
    }))
