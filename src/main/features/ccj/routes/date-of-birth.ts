import * as express from 'express'

import { Paths } from 'ccj/paths'
import { IndividualDateOfBirthGuard } from 'ccj/guards/individualDateOfBirthGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import DateOfBirth from 'forms/models/dateOfBirth'
import User from 'app/idam/user'

import { DraftService } from 'common/draft/draftService'
import { ErrorHandling } from 'common/errorHandling'
import { IndividualDetails } from 'forms/models/individualDetails'

function renderView (form: Form<DateOfBirth>, res: express.Response): void {
  res.render(Paths.dateOfBirthPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.dateOfBirthPage.uri, IndividualDateOfBirthGuard.requestHandler, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    renderView(new Form((user.ccjDraft.document.defendant.partyDetails as IndividualDetails).dateOfBirth), res)
  })
  .post(
    Paths.dateOfBirthPage.uri,
    IndividualDateOfBirthGuard.requestHandler,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<DateOfBirth> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        (user.ccjDraft.document.defendant.partyDetails as IndividualDetails).dateOfBirth = form.model
        await DraftService.save(user.ccjDraft, user.bearerToken)
        res.redirect(Paths.paidAmountPage.uri.replace(':externalId', externalId))

      }
    }))
