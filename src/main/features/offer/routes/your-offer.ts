import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import Offer from 'response/form/models/offer'
import ClaimStoreClient from 'claims/claimStoreClient'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { OfferGuard } from 'offer/guards/offerGuard'

async function renderView (form: Form<Offer>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.offerPage.associatedView, {
      form: form,
      responseDeadline : res.locals.user.claim.responseDeadline
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(
    Paths.offerPage.uri,
    OfferGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(Form.empty(), res, next)
    })
  .post(
    Paths.offerPage.uri,
    OfferGuard.requestHandler,
    FormValidator.requestHandler(Offer, Offer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Offer> = req.body
      console.log(`${JSON.stringify(form.model)}`)
      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        const offer: Offer = form.model
        ClaimStoreClient.saveOfferForUser(user, offer)
        res.redirect(Paths.offerSentConfirmationPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
