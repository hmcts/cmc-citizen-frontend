import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'app/forms/form'
import { DraftCCJService } from 'ccj/draft/DraftCCJService'
import User from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const user: User = res.locals.user
  const alreadyPaid: number = user.ccjDraft.paidAmount.amount || 0

  res.render(Paths.repaymentPlanPage.associatedView, {
    form: form,
    remainingAmount: user.claim.totalAmount - alreadyPaid
  })
}

export default express.Router()
  .get(Paths.repaymentPlanPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.ccjDraft.repaymentPlan), res)
    }))

  .post(Paths.repaymentPlanPage.uri,
    FormValidator.requestHandler(RepaymentPlan, RepaymentPlan.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

        const form: Form<RepaymentPlan> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          console.log(form.errors)
          renderView(form, res)
        } else {
          const { externalId } = req.params
          user.ccjDraft.repaymentPlan = form.model
          await DraftCCJService.save(res, next)
          res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
        }
      }))
