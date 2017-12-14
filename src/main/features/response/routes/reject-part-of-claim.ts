import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaim } from 'response/form/models/rejectPartOfClaim'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'

function isRequestAllowed (res: express.Response): boolean {
  return res.locals.user.responseDraft.document.response !== undefined
    && res.locals.user.responseDraft.document.response.type === ResponseType.PART_ADMISSION
}

function accessDeniedCallback (req: express.Request, res: express.Response): void {
  res.redirect(Paths.responseTypePage.evaluateUri({ externalId: res.locals.user.claim.externalId }))
}

const guardRequestHandler: express.RequestHandler = GuardFactory.create(isRequestAllowed, accessDeniedCallback)

function renderView (form: Form<RejectPartOfClaim>, res: express.Response) {
  res.render(Paths.defenceRejectPartOfClaimPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defenceRejectPartOfClaimPage.uri,
    guardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(new Form(res.locals.user.responseDraft.document.rejectPartOfClaim), res)
    }))
  .post(
    Paths.defenceRejectPartOfClaimPage.uri,
    guardRequestHandler,
    FormValidator.requestHandler(RejectPartOfClaim),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { externalId } = req.params
      const form: Form<RejectPartOfClaim> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.rejectPartOfClaim = form.model

        await new DraftService().save(user.responseDraft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
