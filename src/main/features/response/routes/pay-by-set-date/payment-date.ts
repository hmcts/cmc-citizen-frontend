import * as express from 'express'
import { PayBySetDatePaths, Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { PaymentDateChecker } from 'response/helpers/paymentDateChecker'
import { RoutablePath } from 'common/router/routablePath'

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
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PaymentDate> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const paymentDate: PaymentDate = form.model
        user.responseDraft.document.payBySetDate.paymentDate = paymentDate

        let nextPage: RoutablePath
        if (PaymentDateChecker.isLaterThan28DaysFromNow(paymentDate.date.toMoment())) {
          nextPage = PayBySetDatePaths.explanationPage
        } else {
          user.responseDraft.document.payBySetDate.clearExplanation()
          nextPage = Paths.checkAndSendPage
        }

        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(nextPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
