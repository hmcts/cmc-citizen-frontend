import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { YesNoOption } from 'models/yesNoOption'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityDefendantAddressPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.eligibilityDefendantAddressPage.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityDefendantAddressPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.DEFENDANT_ADDRESS),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.defendantAddress = form.model.defendantAddress

        await new DraftService().save(user.claimDraft, user.bearerToken)

        if (user.claimDraft.document.eligibility.defendantAddress === YesNoOption.NO) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.DEFENDANT_ADDRESS}`)
        } else {
          res.redirect(Paths.eligibilityGovernmentDepartmentPage.uri)
        }
      }
    })
  )
