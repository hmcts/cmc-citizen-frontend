import * as express from 'express'

import { Paths } from 'features/response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HowMuchPaid } from 'features/response/form/models/howMuchPaid'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftService } from 'services/draftService'

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

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantHowMuchPaid.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(new Form(res.locals.user.responseDraft.document.howMuchIsPaid), res, next)
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
        user.responseDraft.document.howMuchIsPaid = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.timelinePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
