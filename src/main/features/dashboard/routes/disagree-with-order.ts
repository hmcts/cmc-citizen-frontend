import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DisagreeReason } from 'dashboard/form/models/disagreeReason'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'

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
    renderView(new Form(new DisagreeReason()), res)
  })
  .post(
    Paths.disagreeReasonPage.uri,
    FormValidator.requestHandler(DisagreeReason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DisagreeReason> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {

        res.redirect(Paths.disagreeReasonPage.uri)
      }
    })
  )
