import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import ClaimValidator from 'app/utils/claimValidator'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<ClaimAmountBreakdown>, res: express.Response): void {
  res.render(Paths.amountPage.associatedView, {
    form: form,
    totalAmount: form.model.totalAmount()
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

export default express.Router()
  .get(Paths.amountPage.uri, (req: express.Request, res: express.Response): void => {
    renderView(new Form(res.locals.user.claimDraft.amount), res)
  })
  .post(Paths.amountPage.uri, FormValidator.requestHandler(ClaimAmountBreakdown, ClaimAmountBreakdown.fromObject, undefined, ['addRow']), actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ClaimAmountBreakdown> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.amount = form.model
        ClaimValidator.claimAmount(form.model.totalAmount())
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.interestPage.uri)
      }
    }
  ))
