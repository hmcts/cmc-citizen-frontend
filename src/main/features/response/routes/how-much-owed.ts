import * as express from 'express'

import { Paths } from 'features/response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HowMuchOwed } from 'features/response/form/models/howMuchOwed'
import User from 'idam/user'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'

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
    await renderView(new Form(res.locals.user.responseDraft.howMuchOwed), res, next)
  }))
  .post(
    Paths.defendantHowMuchOwed.uri,
    FormValidator.requestHandler(HowMuchOwed, HowMuchOwed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HowMuchOwed> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        user.responseDraft.howMuchOwed = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.freeMediationPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
