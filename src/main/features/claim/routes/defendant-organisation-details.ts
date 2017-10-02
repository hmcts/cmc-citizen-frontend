import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { OrganisationDetails } from 'forms/models/organisationDetails'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<OrganisationDetails>, res: express.Response): void {
  res.render(Paths.defendantOrganisationDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantOrganisationDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.defendant.partyDetails as OrganisationDetails), res)
  })
  .post(
    Paths.defendantOrganisationDetailsPage.uri,
    FormValidator.requestHandler(OrganisationDetails, OrganisationDetails.fromObject, 'defendant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<OrganisationDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        (res.locals.user.claimDraft.document.defendant.partyDetails as OrganisationDetails) = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
