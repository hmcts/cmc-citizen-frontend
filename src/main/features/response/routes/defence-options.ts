import * as express from 'express'

import { Paths } from 'response/paths'
import { ResponseType } from 'response/form/models/responseType'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { CounterClaim } from 'response/form/models/counterClaim'
import { ErrorHandling } from 'common/errorHandling'
import User from 'app/idam/user'
import { DraftService } from 'common/draft/draftService'
import { GenericGuard } from 'response/guards/genericResponseGuard'

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

function isAllowed (res: express.Response): boolean {
  return res.locals.user.responseDraft.document.response.type === ResponseType.OWE_NONE
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: res.locals.user.claim.externalId }))
}

export default express.Router()
  .get(
    Paths.defenceOptionsPage.uri,
    GenericGuard.create(isAllowed, accessDeniedCallback),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(new Form(res.locals.user.responseDraft.document.counterClaim), res, next)
    })
  .post(
    Paths.defenceOptionsPage.uri,
    GenericGuard.create(isAllowed, accessDeniedCallback),
    FormValidator.requestHandler(CounterClaim, CounterClaim.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<CounterClaim> = req.body

      if (form.hasErrors()) {
        await renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.counterClaim = form.model
        await DraftService.save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
