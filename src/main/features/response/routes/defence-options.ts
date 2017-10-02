import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { CounterClaim } from 'response/form/models/counterClaim'
import OweNoneResponseRequiredGuard from 'response/guards/oweNoneResponseRequiredGuard'
import { ErrorHandling } from 'common/errorHandling'
import User from 'app/idam/user'

async function renderView (form: Form<CounterClaim>, res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    res.render(Paths.defenceOptionsPage.associatedView, {
      form: form,
      responseDeadline: user.claim.responseDeadline
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(
    Paths.defenceOptionsPage.uri,
    OweNoneResponseRequiredGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(new Form(res.locals.user.responseDraft.document.counterClaim), res, next)
    })
  .post(
    Paths.defenceOptionsPage.uri,
    OweNoneResponseRequiredGuard.requestHandler,
    FormValidator.requestHandler(CounterClaim, CounterClaim.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<CounterClaim> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.counterClaim = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
