import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Over18Defendant } from 'claim/form/models/eligibility/over18Defendant'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityOver18DefendantPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityOver18DefendantPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityOver18DefendantPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.OVER_18_DEFENDANT),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user
        draft.document.eligibility.eighteenOrOverDefendant = form.model.eighteenOrOverDefendant

        await new DraftService().save(draft, user.bearerToken)

        if (draft.document.eligibility.eighteenOrOverDefendant === Over18Defendant.NO) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.UNDER_18_DEFENDANT}`)
        } else {
          res.redirect(Paths.eligibilityClaimTypePage.uri)
        }
      }
    })
  )
