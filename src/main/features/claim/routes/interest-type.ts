import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'

function renderView (form: Form<InterestType>, res: express.Response): void {
  res.render(Paths.interestTypePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.interestTypePage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.interestType), res)
  })
  .post(
    Paths.interestTypePage.uri,
    FormValidator.requestHandler(InterestType),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<InterestType> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.interest = form.model
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.interestType === InterestTypeOption.SAME_RATE) {
          res.redirect(Paths.interestRatePage.uri)
        } else {
          res.redirect(Paths.interestRatePage.uri)
        }
      }
    }))
