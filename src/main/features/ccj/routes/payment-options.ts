import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { CCJPaymentOption, PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import User from 'idam/user'
import { DraftCCJService } from 'ccj/draft/DraftCCJService'

export default express.Router()
  .get(Paths.paymentOptionsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const paymentOption: CCJPaymentOption = res.locals.user.ccjDraft.document.paymentOption

      res.render(Paths.paymentOptionsPage.associatedView, { form: new Form(paymentOption) })
    }))
  .post(Paths.paymentOptionsPage.uri,
    FormValidator.requestHandler(CCJPaymentOption, CCJPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<CCJPaymentOption> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          res.render(Paths.paymentOptionsPage.associatedView, { form: form })
        } else {
          user.ccjDraft.document.paymentOption = form.model
          await DraftCCJService.save(res, next)

          const { externalId } = req.params

          switch (form.model.option) {
            case PaymentType.IMMEDIATELY:
              res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
              break
            case PaymentType.FULL:
              res.redirect(Paths.payBySetDatePage.evaluateUri({ externalId: externalId }))
              break
            case PaymentType.BY_INSTALMENTS:
              res.redirect(Paths.repaymentPlanPage.evaluateUri({ externalId: externalId }))
              break
          }
        }
      }))
