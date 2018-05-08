import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ClaimValidator } from 'utils/claimValidator'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<ClaimAmountBreakdown>, res: express.Response): void {
  res.render(Paths.amountPage.associatedView, {
    form: form,
    totalAmount: form.model.totalAmount(),
    canAddMoreRows: form.model.canAddMoreRows()
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<ClaimAmountBreakdown> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
    }
    return renderView(form, res)
  }
  next()
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.amountPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.amount), res)
  })
  .post(
    Paths.amountPage.uri,
    FormValidator.requestHandler(ClaimAmountBreakdown, ClaimAmountBreakdown.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ClaimAmountBreakdown> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        ClaimValidator.claimAmount(form.model.totalAmount())
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.amount = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.interestPage.uri)
      }
    })
  )
