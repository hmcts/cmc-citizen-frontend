import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { IndividualDetails } from 'forms/models/individualDetails'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<IndividualDetails>, res: express.Response): void {
  res.render(Paths.defendantIndividualDetailsPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantIndividualDetailsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.defendant.partyDetails as IndividualDetails), res)
  })
  .post(
    Paths.defendantIndividualDetailsPage.uri,
    FormValidator.requestHandler(IndividualDetails, IndividualDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<IndividualDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user;

        (draft.document.defendant.partyDetails as IndividualDetails) = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
