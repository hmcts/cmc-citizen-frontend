import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { MobilePhone } from 'forms/models/mobilePhone'

import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<MobilePhone>, res: express.Response) {
  res.render(Paths.defendantMobilePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantMobilePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.responseDraft.document.defendantDetails.mobilePhone), res)
  })
  .post(
    Paths.defendantMobilePage.uri,
    FormValidator.requestHandler(MobilePhone),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<MobilePhone> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.document.defendantDetails.mobilePhone = form.model
        await DraftService.save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
