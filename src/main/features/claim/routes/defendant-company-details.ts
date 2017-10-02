import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { CompanyDetails } from 'forms/models/companyDetails'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'common/draft/draftService'

function renderView (form: Form<CompanyDetails>, res: express.Response): void {
  res.render(Paths.defendantCompanyDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantCompanyDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.document.defendant.partyDetails as CompanyDetails), res)
  })
  .post(
    Paths.defendantCompanyDetailsPage.uri,
    FormValidator.requestHandler(CompanyDetails, CompanyDetails.fromObject, 'defendant'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<CompanyDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.document.defendant.partyDetails = form.model
        await DraftService.save(res.locals.user.claimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantEmailPage.uri)
      }
    }))
