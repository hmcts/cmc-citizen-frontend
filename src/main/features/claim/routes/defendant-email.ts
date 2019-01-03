import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Email } from 'forms/models/email'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { PartyType } from 'common/partyType'

function renderView (form: Form<Email>, res: express.Response, draft: Draft<DraftClaim>): void {
  const individual: boolean = draft.document.defendant.partyDetails.type === PartyType.INDIVIDUAL.value
  res.render(Paths.defendantEmailPage.associatedView,
    {
      form: form,
      individual: individual
    })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantEmailPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.defendant.email), res, draft)
  })
  .post(
    Paths.defendantEmailPage.uri,
    FormValidator.requestHandler(Email),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Email> = req.body
      const draft: Draft<DraftClaim> = res.locals.claimDraft

      if (form.hasErrors()) {
        renderView(form, res, draft)
      } else {
        const user: User = res.locals.user

        draft.document.defendant.email = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.uri)
      }
    }))
