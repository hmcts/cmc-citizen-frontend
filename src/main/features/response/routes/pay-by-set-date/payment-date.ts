import * as express from 'express'
import { PayBySetDatePaths, Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import moment = require('moment')
import { PaymentDateChecker } from 'response/helpers/paymentDateChecker'

function renderView (form: Form<PaymentDate>, res: express.Response) {
  res.render(PayBySetDatePaths.paymentDatePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(PayBySetDatePaths.paymentDatePage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    renderView(new Form(user.responseDraft.document.payBySetDate.paymentDate), res)
  })
  .post(
    PayBySetDatePaths.paymentDatePage.uri,
    FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PaymentDate> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.responseDraft.document.payBySetDate.paymentDate = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        const { externalId } = req.params

        const paymentDate: moment.Moment = user.responseDraft.document.payBySetDate.paymentDate.date.toMoment()
        if (PaymentDateChecker.isLaterThan28DaysFromNow(paymentDate)) {
          res.redirect(PayBySetDatePaths.explanationPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
