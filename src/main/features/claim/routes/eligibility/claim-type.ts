import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
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
import { ClaimType } from 'claim/form/models/eligibility/claimType'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityClaimTypePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityClaimTypePage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityClaimTypePage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.CLAIM_TYPE),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.claimType = form.model.claimType
        await new DraftService().save(draft, user.bearerToken)

        switch (form.model.claimType) {
          case ClaimType.PERSONAL_CLAIM:
            res.redirect(Paths.eligibilitySingleDefendantPage.uri)
            break
          case ClaimType.MULTIPLE_CLAIM:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.MULTIPLE_CLAIMANTS}`)
            break
          case ClaimType.REPRESENTATIVE_CLAIM:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_ON_BEHALF}`)
            break
          default:
            throw new Error(`Unexpected ClaimType: ${form.model.claimType.option}`)
        }

      }
    })
  )
