import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { FormValidator } from 'forms/validation/formValidator'
import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityClaimantAddressPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityClaimantAddressPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityClaimantAddressPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.CLAIMANT_ADDRESS),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.claimantAddress = form.model.claimantAddress
        await new DraftService().save(draft, user.bearerToken)

        if (draft.document.eligibility.claimantAddress === YesNoOption.NO) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIMANT_ADDRESS}`)
        } else {
          res.redirect(Paths.eligibilityDefendantAddressPage.uri)
        }
      }
    })
  )
