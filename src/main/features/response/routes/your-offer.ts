import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import Offer from 'response/form/models/offer'
import Defence from 'response/form/models/defence'
import { OfferDraftMiddleware } from 'response/draft/offerDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'

async function renderView (form: Form<Defence>, res: express.Response, next: express.NextFunction) {
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
  .get(Paths.offerPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.offerDraft.offer), res, next)
  })
  .post(
    Paths.offerPage.uri,
    FormValidator.requestHandler(Offer, Offer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Offer> = req.body
      console.log(`${JSON.stringify(form.model)}`)
      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        user.offerDraft.offer = form.model
        await OfferDraftMiddleware.save(res, next)
        res.redirect(Paths.offerSentConfirmationPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
