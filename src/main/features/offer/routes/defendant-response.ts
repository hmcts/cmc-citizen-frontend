import * as express from 'express'
import { FormValidator } from 'forms/validation/formValidator'
import { Paths } from 'offer/paths'
import { Form } from 'forms/form'
import { DefendantResponse } from 'offer/form/models/defendantResponse'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { OfferGuard } from 'offer/guards/offerGuard'

async function renderView (
  form: Form<DefendantResponse>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.defendantResponsePage.associatedView, {
    form: form,
    claim : res.locals.user.claim,
    offer: res.locals.user.claim.settlement.partyStatements[0].offer
  })
}

export default express.Router()
  .get(
    Paths.defendantResponsePage.uri,
    OfferGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(Form.empty(), res, next)
    }))
  .post(
    Paths.defendantResponsePage.uri,
    OfferGuard.requestHandler,
    FormValidator.requestHandler(DefendantResponse, DefendantResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        res.redirect(Paths.defendantResponsePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
