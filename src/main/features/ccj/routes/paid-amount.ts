import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'app/forms/form'
import { User } from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const claim: Claim = res.locals.user.claim

  res.render(Paths.paidAmountPage.associatedView, { form: form, totalAmount: claim.totalAmountTillToday })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.paidAmountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      renderView(new Form(user.ccjDraft.document.paidAmount), res)
    }))

  .post(Paths.paidAmountPage.uri,
    FormValidator.requestHandler(PaidAmount, PaidAmount.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<PaidAmount> = req.body

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const user: User = res.locals.user

          user.ccjDraft.document.paidAmount = form.model
          await new DraftService().save(user.ccjDraft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId }))
        }
      }))
