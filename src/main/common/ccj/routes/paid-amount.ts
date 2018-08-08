import * as express from 'express'
import { Paths } from 'shared/ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<PaidAmount>, res: express.Response): void {
  const claim: Claim = res.locals.claim

  res.render(Paths.paidAmountPage.associatedView, { form: form, totalAmount: claim.totalAmountTillToday })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.paidAmountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftCCJ> = res.locals.ccjDraft

      renderView(new Form(draft.document.paidAmount), res)
    }))

  .post(Paths.paidAmountPage.uri,
    FormValidator.requestHandler(PaidAmount, PaidAmount.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<PaidAmount> = req.body

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const draft: Draft<DraftCCJ> = res.locals.ccjDraft
          const user: User = res.locals.user

          draft.document.paidAmount = form.model
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId }))
        }
      }))
