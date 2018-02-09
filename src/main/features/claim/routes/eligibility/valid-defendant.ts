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
import { ValidDefendant } from 'claim/form/models/eligibility/validDefendant'

function renderView (form: Form<Eligibility>, res: express.Response): void {
  res.render(Paths.eligibilityValidDefendantPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityValidDefendantPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.eligibility), res)
  })
  .post(
    Paths.eligibilityValidDefendantPage.uri,
    FormValidator.requestHandler(undefined, Eligibility.fromObject, ValidationGroups.VALID_DEFENDANT),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Eligibility> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.eligibility.validDefendant = form.model.validDefendant
        await new DraftService().save(draft, user.bearerToken)

        switch (form.model.validDefendant) {
          case ValidDefendant.PERSONAL_CLAIM:
            res.redirect(Paths.eligibilitySingleDefendantPage.uri)
            break
          case ValidDefendant.MULTIPLE_CLAIM:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.MULTIPLE_DEFENDANTS}`)
            break
          case ValidDefendant.REPRESENTATIVE_CLAIM:
            res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_ON_BEHALF}`)
            break
          default:
            throw new Error(`Unexpected ValidDefendant: ${form.model.validDefendant.option}`)
                // Todo: get a better error message
        }

      }
    })
  )
