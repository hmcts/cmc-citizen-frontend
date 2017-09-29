import * as express from 'express'

import { Paths } from 'features/response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HowMuchPaid } from 'features/response/form/models/howMuchPaid'
import User from 'idam/user'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'

async function renderView (form: Form<HowMuchPaid>, res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    const claim: Claim = user.claim

    res.render(Paths.defendantHowMuchPaid.associatedView, {
      form: form,
      claim: claim
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.defendantHowMuchPaid.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.responseDraft.howMuchIsPaid), res, next)
  }))
  .post(
    Paths.defendantHowMuchPaid.uri,
    FormValidator.requestHandler(HowMuchPaid, HowMuchPaid.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HowMuchPaid> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        user.responseDraft.howMuchIsPaid = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.freeMediationPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
