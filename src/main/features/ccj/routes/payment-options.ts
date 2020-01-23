import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { CCJPaymentOption, PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.paymentOptionsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftCCJ> = res.locals.ccjDraft

      res.render(Paths.paymentOptionsPage.associatedView, { form: new Form(draft.document.paymentOption) })
    }))
  .post(Paths.paymentOptionsPage.uri,
    FormValidator.requestHandler(CCJPaymentOption, CCJPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<CCJPaymentOption> = req.body

        if (form.hasErrors()) {
          res.render(Paths.paymentOptionsPage.associatedView, { form: form })
        } else {
          const draft: Draft<DraftCCJ> = res.locals.ccjDraft
          const user: User = res.locals.user

          draft.document.paymentOption = form.model
          if (form.model.option === PaymentType.IMMEDIATELY) {
            draft.document.repaymentPlan = undefined
            draft.document.payBySetDate = undefined
          }
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params

          switch (form.model.option) {
            case PaymentType.IMMEDIATELY:
              res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
              break
            case PaymentType.BY_SPECIFIED_DATE:
              res.redirect(Paths.payBySetDatePage.evaluateUri({ externalId: externalId }))
              break
            case PaymentType.INSTALMENTS:
              res.redirect(Paths.repaymentPlanPage.evaluateUri({ externalId: externalId }))
              break
          }
        }
      }))
