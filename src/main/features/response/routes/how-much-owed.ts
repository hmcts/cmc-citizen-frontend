import * as express from 'express'

import { Paths } from 'features/response/paths'
import { NumberFormatter } from 'utils/numberFormatter'

import { Form, FormValidationError } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HowMuchOwed } from 'features/response/form/models/howMuchOwed'
import User from 'idam/user'
import { DraftService } from '@hmcts/draft-store-client/dist/common/draft/draftService'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'
import { ValidationError } from 'class-validator'

async function renderView (form: Form<HowMuchOwed>, res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    const claim: Claim = user.claim
    const amount: number = claim.claimData.amount.totalAmount()

    res.render(Paths.defendantHowMuchOwed.associatedView, {
      form: form,
      amount: amount,
      claim: claim
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.defendantHowMuchOwed.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.responseDraft.document.howMuchOwed), res, next)
  }))
  .post(
    Paths.defendantHowMuchOwed.uri,
    FormValidator.requestHandler(HowMuchOwed, HowMuchOwed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HowMuchOwed> = req.body

      const user: User = res.locals.user
      const claim: Claim = user.claim

      if (form.model.amount > claim.claimData.amount.totalAmount()) {
        let totalAmount: string = NumberFormatter.formatMoney(claim.claimData.amount.totalAmount())
        let error = new ValidationError()
        error.property = 'amount'
        error.constraints = { 'amount': 'Enter a valid amount between £1 and ' + totalAmount}
        form.errors.push(new FormValidationError(error))
      }

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        user.responseDraft.document.howMuchOwed = form.model
        await new DraftService()['save'](user.responseDraft, user.bearerToken)
        res.redirect(Paths.timelinePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
