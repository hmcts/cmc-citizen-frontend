import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { Claim } from 'claims/models/claim'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { CCJClient } from 'claims/ccjClient'
import { Redetermination } from 'ccj/form/models/redetermination'

function renderView (form: Form<Redetermination>, res: express.Response): void {
  const claim: Claim = res.locals.claim

  res.render(Paths.redeterminationPage.associatedView, {
    form: form,
    claim: claim
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.redeterminationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(new Form(new Redetermination()), res)
    }))
  .post(
    Paths.redeterminationPage.uri,
    FormValidator.requestHandler(Redetermination, Redetermination.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Redetermination> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user

        await CCJClient.redetermination(claim.externalId, form.model, user)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
