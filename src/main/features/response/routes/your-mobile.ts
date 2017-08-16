import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { MobilePhone } from 'forms/models/mobilePhone'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<MobilePhone>, res: express.Response) {
  res.render(Paths.defendantMobilePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantMobilePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.responseDraft.defendantDetails.mobilePhone), res)
  })
  .post(
    Paths.defendantMobilePage.uri,
    FormValidator.requestHandler(MobilePhone),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<MobilePhone> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.responseDraft.defendantDetails.mobilePhone = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.taskListPage.uri)
      }
    }))
