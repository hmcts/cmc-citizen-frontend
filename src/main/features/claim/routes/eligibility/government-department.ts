import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { YesNoOption } from 'models/yesNoOption'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityGovernmentDepartmentPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityGovernmentDepartmentPage.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityGovernmentDepartmentPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.GOVERNMENT_DEPARTMENT),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.governmentDepartment = form.model.governmentDepartment

        await new DraftService().save(user.claimDraft, user.bearerToken)

        if (user.claimDraft.document.eligibility.governmentDepartment === YesNoOption.YES) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.GOVERNMENT_DEPARTMENT}`)
        } else {
          res.redirect(Paths.eligibilityEligiblePage.uri)
        }
      }
    })
  )
