import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { CCJPaymentOption } from 'ccj/form/models/ccj-payment-type'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import User from 'idam/user'
import { DraftCCJService } from 'ccj/draft/DraftCCJService'

export default express.Router()
  .get(Paths.paymentOptionsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const paymentOption: CCJPaymentOption = res.locals.user.ccjDraft.paymentOption

      res.render(Paths.paymentOptionsPage.associatedView, { form: new Form(paymentOption) })
    }))
  .post(Paths.theirDetailsPage.uri,
    FormValidator.requestHandler(CCJPaymentOption, CCJPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<CCJPaymentOption> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          res.render(Paths.paymentOptionsPage.associatedView, { form: form })
        } else {
          user.ccjDraft.paymentOption = form.model
          await DraftCCJService.save(res, next)
          res.redirect('todo')
        }
      }))
