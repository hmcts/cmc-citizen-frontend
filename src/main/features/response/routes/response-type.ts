import * as express from 'express'
import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'

function renderView (form: Form<Response>, res: express.Response) {
  res.render(Paths.responseTypePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.responseTypePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(res.locals.user.responseDraft.document.response), res)
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
        user.responseDraft.document.response = form.model

        await new DraftService().save(user.responseDraft, user.bearerToken)

        const responseType = user.responseDraft.document.response.type

        switch (responseType) {
          case ResponseType.DEFENCE:
            res.redirect(Paths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: externalId }))
            break
          case ResponseType.PART_ADMISSION:
            res.redirect(Paths.defenceRejectPartOfClaimPage.evaluateUri({ externalId: user.claim.externalId }))
            break
          case ResponseType.FULL_ADMISSION:
            res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
            break
          default:
            next(new Error(`Unknown response type: ${responseType}`))
        }
      }
    }))
