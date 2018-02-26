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
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityDefendantAddressPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityDefendantAddressPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityDefendantAddressPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.DEFENDANT_ADDRESS),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.defendantAddress = form.model.defendantAddress
        await new DraftService().save(draft, user.bearerToken)

        if (draft.document.eligibility.defendantAddress === YesNoOption.NO) {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.DEFENDANT_ADDRESS}`)
        } else {
          res.redirect(Paths.eligibilityOver18Page.uri)
        }
      }
    })
  )
