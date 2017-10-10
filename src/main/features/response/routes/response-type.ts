import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { DraftService } from 'common/draft/draftService'
import { GenericGuard } from 'response/guards/genericResponseGuard'

function renderView (form: Form<Response>, res: express.Response) {
  res.render(Paths.responseTypePage.associatedView, {
    form: form
  })
}

function isAllowed (res: express.Response): boolean {
  if (res.locals.user.responseDraft.document.response.type === ResponseType.OWE_SOME_PAID_NONE || ResponseType.OWE_ALL_PAID_NONE || ResponseType.OWE_NONE) {
    return true
  }
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: res.locals.user.claim.externalId }))
}

export default express.Router()
  .get(Paths.responseTypePage.uri,
    GenericGuard.create(isAllowed, accessDeniedCallback),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(res.locals.user.responseDraft.document.response), res)
    }))
  .post(
    Paths.responseTypePage.uri,
    GenericGuard.create(isAllowed, accessDeniedCallback),
    FormValidator.requestHandler(Response, Response.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { externalId } = req.params
      const form: Form<Response> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.response = form.model
        await DraftService.save(user.responseDraft, user.bearerToken)

        const responseType = user.responseDraft.document.response.type

        switch (responseType) {
          case ResponseType.OWE_NONE:
            res.redirect(Paths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: externalId }))
            break
          case ResponseType.OWE_SOME_PAID_NONE:
            res.redirect(Paths.defenceRejectPartOfClaimPage.evaluateUri({ externalId: user.claim.externalId }))
            break
          case ResponseType.OWE_ALL_PAID_NONE:
            res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
            break
          default:
            next(new Error('Unknown response type: ' + responseType))
        }
      }
    }))
