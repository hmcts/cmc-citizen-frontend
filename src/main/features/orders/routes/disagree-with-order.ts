import * as express from 'express'

import { Paths } from 'orders/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DisagreeReason } from 'orders/form/models/disagreeReason'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { OrdersDraft } from 'orders/draft/ordersDraft'

function renderView (form: Form<DisagreeReason>, res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.disagreeReasonPage.associatedView, {
    otherParty: claim.otherPartyName(user),
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.disagreeReasonPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<OrdersDraft> = res.locals.draft

    renderView(new Form<DisagreeReason>(draft.document.disagreeReason), res)
  })
  .post(
    Paths.disagreeReasonPage.uri,
    FormValidator.requestHandler(DisagreeReason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DisagreeReason> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {

        const draft: Draft<OrdersDraft> = res.locals.draft
        const user: User = res.locals.user

        draft.document.disagreeReason = form.model

        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.disagreeReasonPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
