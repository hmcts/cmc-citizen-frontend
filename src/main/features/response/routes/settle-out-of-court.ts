import * as express from 'express'

import { Paths } from 'response/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { SettleOutOfCourt, SettleOutOfCourtOption } from 'response/form/models/SettleOutOfCourt'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { OfferGuard } from 'response/guards/offerGuard'

function renderView (form: Form<SettleOutOfCourt>, res: express.Response, next: express.NextFunction) {
  try {
    res.render(Paths.settleOutOfCourtPage.associatedView, {
      form: form,
      responseDeadline : res.locals.user.claim.responseDeadline
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(
    Paths.settleOutOfCourtPage.uri,
    OfferGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(Form.empty(), res, next)
    })
  .post(
    Paths.settleOutOfCourtPage.uri,
    OfferGuard.requestHandler,
    FormValidator.requestHandler(SettleOutOfCourt),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<SettleOutOfCourt> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        if (form.model.option === SettleOutOfCourtOption.YES) {
          res.redirect(Paths.offerPage.evaluateUri({ externalId: user.claim.externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
        }
      }
    }))
