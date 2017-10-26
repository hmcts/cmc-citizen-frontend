import * as express from 'express'

import { Paths } from 'response/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'app/forms/form'
import { DraftService } from 'common/draft/draftService'
import User from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaymentPlan } from 'response/form/models/paymentPlan'
import { FormValidator } from 'forms/validation/formValidator'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const user: User = res.locals.user
  const alreadyPaid: number = user.responseDraft.document.paidAmount.amount || 0

  res.render(Paths.defenceFullPartialPaymentPlanPage.associatedView, {
    form: form,
    remainingAmount: user.claim.totalAmount - alreadyPaid
  })
}

export default express.Router()
  .get(Paths.defenceFullPartialPaymentPlanPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.paymentPlan), res)
    }))

  .post(Paths.defenceFullPartialPaymentPlanPage.uri,
    FormValidator.requestHandler(PaymentPlan, PaymentPlan.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

        const form: Form<PaymentPlan> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const { externalId } = req.params
          user.responseDraft.document.paymentPlan = form.model
          user.responseDraft.document.payBySetDate = undefined
          await DraftService.save(user.responseDraft, user.bearerToken)
          res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
        }
      }))
