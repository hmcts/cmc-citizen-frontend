import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DateOfBirth } from 'forms/models/dateOfBirth'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { IndividualDetails } from 'forms/models/individualDetails'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.claimantDateOfBirthPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form((draft.document.claimant.partyDetails as IndividualDetails).dateOfBirth), res)
  })
  .post(
    Paths.claimantDateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user;

        (draft.document.claimant.partyDetails as IndividualDetails).dateOfBirth = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.claimantPhonePage.uri)
      }
    }))
