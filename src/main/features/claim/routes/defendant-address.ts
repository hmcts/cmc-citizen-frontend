import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { Address } from 'app/forms/models/address'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<Address>, res: express.Response): void {
  res.render(Paths.defendantAddressPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.partyDetails.address), res)
  })
  .post(
    Paths.defendantAddressPage.uri,
    FormValidator.requestHandler(Address),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.defendant.partyDetails.address = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
