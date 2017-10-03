import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'

function renderView (form: Form<Response>, res: express.Response) {
  res.render(Paths.responseTypePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.responseTypePage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(new Form(res.locals.user.responseDraft.response), res)
  }))
  .post(
    Paths.responseTypePage.uri,
    FormValidator.requestHandler(Response, Response.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { externalId } = req.params
      const form: Form<Response> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.response = form.model
        await ResponseDraftMiddleware.save(res, next)

        if (ResponseType.OWE_NONE === form.model.type) {
          res.redirect(Paths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.defenceRejectPartOfClaimPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
