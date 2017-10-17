import * as express from 'express'
import { Paths } from 'ccj/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PayBySetDate } from 'ccj/form/models/payBySetDate'
import User from 'idam/user'
import { DraftService } from 'services/DraftService'
import { ErrorHandling } from 'common/errorHandling'


function renderView (form: Form<PayBySetDate>, res: express.Response): void {
  res.render(Paths.payBySetDatePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.payBySetDatePage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    renderView(new Form(user.ccjDraft.document.payBySetDate), res)
  })
  .post(
    Paths.payBySetDatePage.uri,
    FormValidator.requestHandler(PayBySetDate, PayBySetDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<PayBySetDate> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const { externalId } = req.params
        user.ccjDraft.document.payBySetDate = form.model
        user.ccjDraft.document.repaymentPlan = undefined
        await new DraftService()['save'](user.ccjDraft, user.bearerToken)
        res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
      }
    }))
