import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { CompanyDetails } from 'forms/models/companyDetails'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<CompanyDetails>, res: express.Response): void {
  res.render(Paths.claimantCompanyDetailsPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantCompanyDetailsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.claimant.partyDetails as CompanyDetails), res)
  })
  .post(
    Paths.claimantCompanyDetailsPage.uri,
    FormValidator.requestHandler(CompanyDetails, CompanyDetails.fromObject, 'claimant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<CompanyDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.claimant.partyDetails = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.claimantPhonePage.uri)
      }
    }))
