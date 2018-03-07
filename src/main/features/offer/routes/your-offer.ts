import * as express from 'express'

import { Paths } from 'offer/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Offer } from 'offer/form/models/offer'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { OfferClient } from 'claims/offerClient'
import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'

async function renderView (form: Form<Offer>, res: express.Response, next: express.NextFunction) {
  const claim: Claim = res.locals.claim
  const futureDate: Moment = MomentFactory.currentDate().add(30, 'days')

  res.render(Paths.offerPage.associatedView, {
    form: form,
    claim: claim,
    futureDate: futureDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.offerPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(Form.empty(), res, next)
    }))
  .post(
    Paths.offerPage.uri,
    FormValidator.requestHandler(Offer, Offer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Offer> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user
        const offer: Offer = form.model
        await OfferClient.makeOffer(claim.externalId, user, offer)
        res.redirect(Paths.offerConfirmationPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
