import * as express from 'express'

import { Paths } from 'features/response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PaymentDeclaration } from 'features/response/form/models/paymentDeclaration'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<PaymentDeclaration>, res: express.Response) {
  res.render(Paths.whenDidYouPay.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.whenDidYouPay.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    renderView(new Form(draft.document.whenDidYouPay), res)
  }))
  .post(
    Paths.whenDidYouPay.uri,
    FormValidator.requestHandler(PaymentDeclaration, PaymentDeclaration.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PaymentDeclaration> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.whenDidYouPay = form.model
        await new DraftService().save(draft, user.bearerToken)
        const claim: Claim = res.locals.claim

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
