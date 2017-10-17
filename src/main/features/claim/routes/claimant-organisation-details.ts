import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { OrganisationDetails } from 'forms/models/organisationDetails'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/DraftService'


function renderView (form: Form<OrganisationDetails>, res: express.Response): void {
  res.render(Paths.claimantOrganisationDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantOrganisationDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.claimant.partyDetails as OrganisationDetails), res)
  })
  .post(
    Paths.claimantOrganisationDetailsPage.uri,
    FormValidator.requestHandler(OrganisationDetails, OrganisationDetails.fromObject, 'claimant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<OrganisationDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.document.claimant.partyDetails = form.model

        await new DraftService()['save'](res.locals.user.claimDraft, res.locals.user.bearerToken)

        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
