import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNoOption } from 'models/yesNoOption'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityHelpWithFeesPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.eligibilityHelpWithFeesPage.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityHelpWithFeesPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.HELP_WITH_FEES),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.helpWithFees = form.model.helpWithFees

        await new DraftService().save(user.claimDraft, user.bearerToken)

        const option: YesNoOption = user.claimDraft.document.eligibility.helpWithFees
        if (option === YesNoOption.NO) {
          res.redirect(Paths.eligibilityClaimantAddressPage.uri)
        } else {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.HELP_WITH_FEES}`)
        }

      }
    })
  )
