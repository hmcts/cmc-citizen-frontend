import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'app/forms/form'
import { DraftCCJService } from 'ccj/draft/DraftCCJService'
import User from 'idam/user'
import PaidAmount from 'ccj/form/models/paidAmount'
import { FormValidator } from 'forms/validation/formValidator'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  res.render(Paths.claimAmountPage.associatedView, { form: form, totalAmount: res.locals.user.claim.totalAmount })
}

export default express.Router()
  .get(Paths.claimAmountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.ccjDraft.paidAmount), res)
    }))

  .post(Paths.claimAmountPage.uri,
    FormValidator.requestHandler(PaidAmount, PaidAmount.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<PaidAmount> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const { externalId } = req.params
          user.ccjDraft.paidAmount = form.model
          await DraftCCJService.save(res, next)
          res.redirect(Paths.claimAmountSummaryPage.uri.replace(':externalId', externalId))
        }
      }))
