import * as express from 'express'

import { Paths } from 'features/response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HowMuchOwed } from 'features/response/form/models/howMuchOwed'
import User from 'idam/user'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<HowMuchOwed>, res: express.Response): void {
  const name: string = res.locals.user.forename + ' ' + res.locals.user.surname
  res.render(Paths.defendantHowMuchOwed.associatedView, { form: form, name: name })
}

export default express.Router()
  .get(Paths.defendantHowMuchOwed.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.responseDraft.howMuchOwed), res)
  })
  .post(
    Paths.defendantHowMuchOwed.uri,
    FormValidator.requestHandler(HowMuchOwed, HowMuchOwed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<HowMuchOwed> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.responseDraft.howMuchOwed = form.model
        await ResponseDraftMiddleware.save(res, next)
        res.redirect('toDo')
      }
    })
  )
