import * as express from 'express'

import { Paths } from 'features/response/paths'
import { NumberFormatter } from 'utils/numberFormatter'

import { Form, FormValidationError } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HowMuchOwed } from 'features/response/form/models/howMuchOwed'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { ValidationError } from 'class-validator'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

async function renderView (form: Form<HowMuchOwed>, res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = res.locals.claim
    res.render(Paths.defendantHowMuchOwed.associatedView, {
      form: form,
      amount: await claim.totalAmountTillToday,
      claim: claim
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantHowMuchOwed.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    await renderView(new Form(draft.document.howMuchOwed), res, next)
  }))
  .post(
    Paths.defendantHowMuchOwed.uri,
    FormValidator.requestHandler(HowMuchOwed, HowMuchOwed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HowMuchOwed> = req.body
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user

      const totalAmountTillToday: number = await claim.totalAmountTillToday

      if (form.model.amount > totalAmountTillToday) {
        let totalAmount: string = NumberFormatter.formatMoney(totalAmountTillToday)
        let error = new ValidationError()
        error.property = 'amount'
        error.constraints = { amount: 'Enter a valid amount between £1 and ' + totalAmount }
        form.errors.push(new FormValidationError(error))
      }

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft

        draft.document.howMuchOwed = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.timelinePage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
