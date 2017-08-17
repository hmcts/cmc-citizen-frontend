import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Name } from 'forms/models/name'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<Name>, res: express.Response): void {
  res.render(Paths.defendantDetailsPath.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantDetailsPath.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.name), res)
  })
  .post(
    Paths.defendantDetailsPath.uri,
    FormValidator.requestHandler(Name),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Name> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.defendant.name = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantAddressPage.uri)
      }
    }))
