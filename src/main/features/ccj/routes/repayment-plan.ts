import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'app/forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const draft: Draft<DraftCCJ> = res.locals.ccjDraft
  const user: User = res.locals.user
  const alreadyPaid: number = draft.document.paidAmount.amount || 0

  res.render(Paths.repaymentPlanPage.associatedView, {
    form: form,
    remainingAmount: user.claim.totalAmountTillToday - alreadyPaid
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftCCJ> = res.locals.ccjDraft
      renderView(new Form(draft.document.repaymentPlan), res)
    }))

  .post(Paths.repaymentPlanPage.uri,
    FormValidator.requestHandler(RepaymentPlan, RepaymentPlan.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<RepaymentPlan> = req.body

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const draft: Draft<DraftCCJ> = res.locals.ccjDraft
          const user: User = res.locals.user

          draft.document.repaymentPlan = form.model
          draft.document.payBySetDate = undefined
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(Paths.checkAndSendPage.evaluateUri({ externalId: externalId }))
        }
      }))
