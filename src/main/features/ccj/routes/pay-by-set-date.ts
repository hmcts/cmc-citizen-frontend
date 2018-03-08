import * as express from 'express'
import { Paths } from 'ccj/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PayBySetDate } from 'forms/models/payBySetDate'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'common/errorHandling'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'

function renderView (form: Form<PayBySetDate>, res: express.Response): void {
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
    FormValidator.requestHandler(PayBySetDate, PayBySetDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PayBySetDate> = req.body
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
