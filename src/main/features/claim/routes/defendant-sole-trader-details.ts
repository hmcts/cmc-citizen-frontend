import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<SoleTraderDetails>, res: express.Response): void {
  res.render(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.defendant.partyDetails as SoleTraderDetails), res)
  })
  .post(
    Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri,
    FormValidator.requestHandler(SoleTraderDetails, SoleTraderDetails.fromObject, 'defendant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SoleTraderDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user;

        (draft.document.defendant.partyDetails as SoleTraderDetails) = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
