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

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityClaimValuePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityClaimValuePage.uri, (req: express.Request, res: express.Response): void => {
    const user: User = res.locals.user
    renderView(new Form(user.claimDraft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityClaimValuePage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.CLAIM_VALUE),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.claimDraft.document.eligibility.claimValue = form.model.claimValue

        await new DraftService().save(user.claimDraft, user.bearerToken)

        const claimValue: ClaimValue = user.claimDraft.document.eligibility.claimValue
        switch (claimValue) {
          case ClaimValue.NOT_KNOWN:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_NOT_KNOWN}`)
            break
          case ClaimValue.OVER_10000:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_OVER_10000}`)
            break
          case ClaimValue.UNDER_10000:
            res.redirect(Paths.eligibilitySingleClaimantPage.uri)
            break
          default:
            throw new Error(`Unexpected claimValue: ${claimValue.option}`)
        }

      }
    })
  )
