import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { MobilePhone } from 'forms/models/mobilePhone'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<MobilePhone>, res: express.Response): void {
  res.render(Paths.defendantPhonePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantPhonePage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.defendant.mobilePhone), res)
  })
  .post(
    Paths.defendantPhonePage.uri,
    FormValidator.requestHandler(MobilePhone, MobilePhone.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<MobilePhone> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.defendant.mobilePhone = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.uri)
      }
    }))
