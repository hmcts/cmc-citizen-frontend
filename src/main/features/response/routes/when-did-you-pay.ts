import * as express from 'express'

import { Paths } from 'features/response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { WhenDidYouPay } from 'features/response/form/models/whenDidYouPay'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

async function renderView (form: Form<WhenDidYouPay>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.whenDidYouPay.associatedView, {
      form: form
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.whenDidYouPay.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    await renderView(new Form(draft.document.whenDidYouPay), res, next)
  }))
  .post(
    Paths.whenDidYouPay.uri,
    FormValidator.requestHandler(WhenDidYouPay, WhenDidYouPay.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<WhenDidYouPay> = req.body
      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.whenDidYouPay = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
