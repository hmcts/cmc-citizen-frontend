import * as express from 'express'
import { Paths } from 'ccj/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'

function renderView (form: Form<PaymentDate>, res: express.Response): void {
  const futureDate: Moment = MomentFactory.currentDate().add(30, 'days')
  res.render(Paths.payBySetDatePage.associatedView, {
    form: form,
    futureDate: futureDate })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.payBySetDatePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftCCJ> = res.locals.ccjDraft
    renderView(new Form(draft.document.payBySetDate), res)
  })
  .post(
    Paths.payBySetDatePage.uri,
    FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PaymentDate> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftCCJ> = res.locals.ccjDraft
        const user: User = res.locals.user

        draft.document.payBySetDate = form.model
        draft.document.repaymentPlan = undefined
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
      }
    }))
