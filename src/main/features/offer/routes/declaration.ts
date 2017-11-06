import * as express from 'express'
import { Paths } from 'offer/paths'
import User from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import Claim from 'claims/models/claim'

function renderView (form: Form<Declaration>, claim: Claim, res: express.Response) {
  res.render(
    Paths.declarationPage.associatedView,
    {
      claim: claim,
      form: form,
      offer: claim.defendantOffer,
      paths: Paths
    }
  )
}

export default express.Router()
  .get(
    Paths.declarationPage.uri,
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user: User = res.locals.user
        renderView(Form.empty(), user.claim, res)
      }
    )
  )
  .post(
    Paths.declarationPage.uri,
    FormValidator.requestHandler(Declaration, Declaration.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, user.claim, res)
      } else {
        // TODO: persist and redirect to confirmation page
        renderView(form, user.claim, res)
      }
    }))
