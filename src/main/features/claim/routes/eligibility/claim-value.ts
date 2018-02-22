import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { FormValidator } from 'forms/validation/formValidator'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityClaimValuePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityClaimValuePage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityClaimValuePage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.CLAIM_VALUE),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.claimValue = form.model.claimValue
        await new DraftService().save(draft, user.bearerToken)

        const claimValue: ClaimValue = draft.document.eligibility.claimValue
        switch (claimValue) {
          case ClaimValue.NOT_KNOWN:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_NOT_KNOWN}`)
            break
          case ClaimValue.OVER_10000:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_OVER_10000}`)
            break
          case ClaimValue.UNDER_10000:
            res.redirect(Paths.eligibilityHelpWithFeesPage.uri)
            break
          default:
            throw new Error(`Unexpected claimValue: ${claimValue.option}`)
        }

      }
    })
  )
