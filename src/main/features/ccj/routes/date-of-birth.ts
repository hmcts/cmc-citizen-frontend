import * as express from 'express'

import { Paths } from 'ccj/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import DateOfBirth from 'forms/models/dateOfBirth'
import User from 'app/idam/user'

import { DraftCCJService } from 'ccj/draft/DraftCCJService'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.dateOfBirthPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.dateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    renderView(new Form(user.ccjDraft.defendant.dateOfBirth), res)
  })
  .post(
    Paths.dateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const { externalId } = req.params
        res.locals.user.ccjDraft.defendant.dateOfBirth = form.model
        await DraftCCJService.save(res, next)
        res.redirect(Paths.paidAmountPage.uri.replace(':externalId', externalId))

      }
    }))
