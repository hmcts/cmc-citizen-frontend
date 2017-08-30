import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentType'
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
  .post(Paths.paymentOptionsPage.uri,
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

          const { externalId } = req.params

          switch (form.model.option) {
            case CCJPaymentOption.IMMEDIATELY.option:
              res.redirect(Paths.checkYourAnswerPage.uri.replace(':externalId', externalId))
              break
            case CCJPaymentOption.FULL.option:
              res.redirect(Paths.payBySetDatePage.uri.replace(':externalId', externalId))
              break
            case CCJPaymentOption.BY_INSTALMENTS.option:
              res.redirect(Paths.repaymentPlanPage.uri.replace(':externalId', externalId))
              break
            default:
              console.log(form.model)
          }
        }
      }))
