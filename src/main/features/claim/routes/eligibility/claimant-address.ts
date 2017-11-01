import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import User from 'idam/user'
import { DraftService } from 'services/draftService'
import { FormValidator } from 'forms/validation/formValidator'
import { Eligibility } from 'drafts/models/eligibility/Eligibility'
import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityClaimantAddressPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.eligibilityClaimantAddressPage.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityClaimantAddressPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.CLAIMANT_ADDRESS),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.claimantAddress = form.model.claimantAddress

        await new DraftService().save(user.claimDraft, user.bearerToken)

        if (user.claimDraft.document.eligibility.claimantAddress === YesNoOption.NO) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIMANT_ADDRESS}`)
        } else {
          res.redirect(Paths.eligibilityDefendantAddressPage.uri)
        }
      }
    })
  )
