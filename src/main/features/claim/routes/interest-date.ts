import * as express from 'express'

import { Paths } from 'claim/paths'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import InterestDate from 'forms/models/interestDate'
function renderView (form: Form<InterestDate>, res: express.Response): void {
  res.render(Paths.interestDatePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.interestDatePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.interestDate), res)
  })
  .post(
    Paths.interestDatePage.uri,
    FormValidator.requestHandler(InterestDate, InterestDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<InterestDate> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.interestDate = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.feesPage.uri)
      }
    }))
