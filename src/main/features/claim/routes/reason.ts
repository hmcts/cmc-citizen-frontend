import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Reason } from 'claim/form/models/reason'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<Reason>, res: express.Response): void {
  const draft: Draft<DraftClaim> = res.locals.claimDraft
  const defendantName = (
    draft.document.defendant
    && draft.document.defendant.partyDetails
    && draft.document.defendant.partyDetails.name)
    ? draft.document.defendant.partyDetails.name : ''

  res.render(Paths.reasonPage.associatedView, { form: form, defendantName: defendantName })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.reasonPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.reason), res)
  })
  .post(
    Paths.reasonPage.uri,
    FormValidator.requestHandler(Reason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Reason> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.reason = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.timelinePage.uri)
      }
    }))
