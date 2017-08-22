import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { ErrorHandling } from 'common/errorHandling'
import { IndividualDetails } from 'forms/models/individualDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'

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
    if (res.locals.user.claimDraft.defendant.partyDetails) {
      console.log(`here.........`)
      renderView(new Form(PartyTypeResponse.valueOf(res.locals.user.claimDraft.defendant.partyDetails.type)), res, next)
    } else {
      console.log(`here.........here........`)
      renderView(Form.empty<PartyTypeResponse>(), res, next)
    }
  })
  .post(
    Paths.defendantPartyTypeSelectionPage.uri,
    FormValidator.requestHandler(PartyTypeResponse, PartyTypeResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PartyTypeResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        switch (form.model.type) {
          case PartyType.INDIVIDUAL:
            res.locals.user.claimDraft.defendant.partyDetails = new IndividualDetails()
            res.redirect(Paths.defendantIndividualDetailsPage.uri)
            break
          case PartyType.COMPANY:
            res.locals.user.claimDraft.claimant.partyDetails = new CompanyDetails()
            res.redirect(Paths.defendantCompanyDetailsPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED:
            res.locals.user.claimDraft.claimant.partyDetails = new SoleTraderDetails()
            res.redirect(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri)
            break
          case PartyType.ORGANISATION:
            res.locals.user.claimDraft.claimant.partyDetails = new OrganisationDetails()
            res.redirect(Paths.defendantOrganisationDetailsPage.uri)
            break
          default:
            throw Error('Something went wrong, No defendant type is set')
        }
      }
    }))
