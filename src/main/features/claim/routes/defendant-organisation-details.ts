import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { OrganisationDetails } from 'forms/models/organisationDetails'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<OrganisationDetails>, res: express.Response): void {
  res.render(Paths.defendantOrganisationDetailsPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantOrganisationDetailsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.defendant.partyDetails as OrganisationDetails), res)
  })
  .post(
    Paths.defendantOrganisationDetailsPage.uri,
    FormValidator.requestHandler(OrganisationDetails, OrganisationDetails.fromObject, 'defendant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<OrganisationDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user;

        (draft.document.defendant.partyDetails as OrganisationDetails) = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
