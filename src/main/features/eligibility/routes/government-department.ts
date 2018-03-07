import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { YesNoOption } from 'models/yesNoOption'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityGovernmentDepartmentPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityGovernmentDepartmentPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityGovernmentDepartmentPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.GOVERNMENT_DEPARTMENT),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.governmentDepartment = form.model.governmentDepartment
        await new DraftService().save(draft, user.bearerToken)

        if (draft.document.eligibility.governmentDepartment === YesNoOption.YES) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.GOVERNMENT_DEPARTMENT}`)
        } else {
          res.redirect(Paths.eligibilityClaimIsForTenancyDepositPage.uri)
        }
      }
    })
  )
