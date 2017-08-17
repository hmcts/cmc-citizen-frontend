import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { CompanyDetails } from 'forms/models/companyDetails'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

function renderView (form: Form<CompanyDetails>, res: express.Response): void {
  res.render(Paths.defendantCompanyDetailsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantCompanyDetailsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.partyDetails as CompanyDetails), res)
  })
  .post(
    Paths.defendantCompanyDetailsPage.uri,
    FormValidator.requestHandler(CompanyDetails, CompanyDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<CompanyDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.claimant.partyDetails = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimantMobilePage.uri)
      }
    }))
