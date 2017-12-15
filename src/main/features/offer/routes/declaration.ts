import * as express from 'express'
import { Paths } from 'offer/paths'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import { Claim } from 'claims/models/claim'
import { OfferClient } from 'claims/offerClient'

function renderView (form: Form<Declaration>, res: express.Response) {
  const claim: Claim = res.locals.claim
  res.render(
    Paths.declarationPage.associatedView,
    {
      claim: claim,
      form: form,
      offer: claim.defendantOffer
    }
  )
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.declarationPage.uri,
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        renderView(Form.empty(), res)
      }
    )
  )
  .post(
    Paths.declarationPage.uri,
    FormValidator.requestHandler(Declaration, Declaration.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user

        await OfferClient.acceptOffer(claim.id, user)

        res.redirect(Paths.acceptedPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
