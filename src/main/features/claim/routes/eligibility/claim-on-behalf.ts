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
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

const path = Paths.eligibilityClaimOnBehalfPage

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(path.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(path.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    path.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.CLAIM_ON_BEHALF),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.claimOnBehalf = form.model.claimOnBehalf
        await new DraftService().save(draft, user.bearerToken)

        const option: YesNoOption = draft.document.eligibility.claimOnBehalf
        if (option === YesNoOption.NO) {
          res.redirect(Paths.eligibilityClaimIsForTenancyDepositPage.uri)
        } else {
          res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_ON_BEHALF}`)
        }
      }
    })
  )
