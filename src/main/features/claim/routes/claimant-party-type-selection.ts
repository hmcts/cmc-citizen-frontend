import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { ErrorHandling } from 'common/errorHandling'

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
    if (res.locals.user.claimDraft.claimant.partyDetails) {
      renderView(new Form(PartyTypeResponse.valueOf(res.locals.user.claimDraft.claimant.partyDetails.type)), res, next)
    } else {
      renderView(Form.empty<PartyTypeResponse>(), res, next)
    }
  })
  .post(
    Paths.claimantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        switch (form.model.type) {
          case PartyType.INDIVIDUAL:
            res.locals.user.claimDraft.claimant.partyDetails = new IndividualDetails()
            res.redirect(Paths.claimantIndividualDetailsPage.uri)
            break
          case PartyType.COMPANY:
            res.locals.user.claimDraft.claimant.partyDetails = new CompanyDetails()
            res.redirect(Paths.claimantCompanyDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED:
            res.locals.user.claimDraft.claimant.partyDetails = new SoleTraderDetails()
            res.redirect(Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.ORGANISATION:
            res.locals.user.claimDraft.claimant.partyDetails = new OrganisationDetails()
            res.redirect(Paths.claimantOrganisationDetailsPage.uri)
            break
          default:
            throw Error('Something went wrong, No claimant type is set')
        }
      }
    }))
