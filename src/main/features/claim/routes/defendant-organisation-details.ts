import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { OrganisationDetails } from 'forms/models/organisationDetails'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'

function renderView (form: Form<OrganisationDetails>, res: express.Response): void {
  res.render(Paths.defendantOrganisationDetailsPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantOrganisationDetailsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: DraftClaim = res.locals.user.claimDraft.document

    renderView(new Form(draft.defendant.partyDetails as OrganisationDetails), res)
  })
  .post(
    Paths.defendantOrganisationDetailsPage.uri,
    FormValidator.requestHandler(OrganisationDetails, OrganisationDetails.fromObject, 'defendant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<OrganisationDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user;

        (user.claimDraft.document.defendant.partyDetails as OrganisationDetails) = form.model
        await new DraftService().save(user.claimDraft, user.bearerToken)

        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
