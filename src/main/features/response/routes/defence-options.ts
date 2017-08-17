import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { CounterClaim } from 'response/form/models/counterClaim'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import OweNoneResponseRequiredGuard from 'response/guards/oweNoneResponseRequiredGuard'
import ErrorHandling from 'common/errorHandling'

async function renderView (form: Form<CounterClaim>, res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = await ClaimStoreClient.retrieveByDefendantId(res.locals.user.id)
    res.render(Paths.defenceOptionsPage.associatedView, {
      form: form,
      responseDeadline: claim.responseDeadline
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
      await renderView(new Form(res.locals.user.responseDraft.counterClaim), res, next)
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
        res.locals.user.responseDraft.counterClaim = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.taskListPage.uri)
      }
    }))
