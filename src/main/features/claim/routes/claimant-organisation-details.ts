import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { OrganisationDetails } from 'forms/models/organisationDetails'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<OrganisationDetails>, res: express.Response): void {
  res.render(Paths.claimantOrganisationDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantOrganisationDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.partyDetails as OrganisationDetails), res)
  })
  .post(
    Paths.claimantOrganisationDetailsPage.uri,
    FormValidator.requestHandler(OrganisationDetails, OrganisationDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<OrganisationDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        (res.locals.user.claimDraft.claimant.partyDetails as OrganisationDetails) = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
