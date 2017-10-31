import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import User from 'idam/user'
import { Eligibility } from 'drafts/models/eligibility/Eligibility'
import { YesNoOption } from 'models/yesNoOption'
import { FormValidator } from 'forms/validation/formValidator'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityClaimValuePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.eligibilityClaimValuePage.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityClaimValuePage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, 'claim-value'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.claimValue = form.model.claimValue

        await new DraftService().save(user.claimDraft, user.bearerToken)

        if (user.claimDraft.document.eligibility.claimValue === YesNoOption.YES) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=claim-value`)
        } else {
          res.redirect(Paths.eligibilityOver18Page.uri)
        }
      }
    })
  )
