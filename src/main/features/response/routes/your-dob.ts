import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import DateOfBirth from 'forms/models/dateOfBirth'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<DateOfBirth>, res: express.Response) {
  res.render(Paths.defendantDateOfBirthPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.responseDraft.defendantDetails.dateOfBirth), res)
  })
  .post(
    Paths.defendantDateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DateOfBirth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.responseDraft.defendantDetails.dateOfBirth = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantMobilePage.uri)
      }
    }))
