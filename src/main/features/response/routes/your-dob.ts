import * as express from 'express'
import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DateOfBirth, ValidationErrors } from 'forms/models/dateOfBirth'
import { PartyType } from 'common/partyType'
import { ErrorHandling } from 'shared/errorHandling'
import { IndividualDetails } from 'forms/models/individualDetails'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'

const dateUnder18Pattern: string = ValidationErrors.DATE_UNDER_18.replace('%s', '.*')

function renderView (form: Form<DateOfBirth>, res: express.Response) {
  res.render(Paths.defendantDateOfBirthPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantDateOfBirthPage.uri, (req: express.Request, res: express.Response) => {
    const claim: Claim = res.locals.claim
    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    switch (draft.document.defendantDetails.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        renderView(new Form((draft.document.defendantDetails.partyDetails as IndividualDetails).dateOfBirth), res)
        break
      default:
        res.redirect(Paths.defendantPhonePage.evaluateUri({ externalId: claim.externalId }))
        break
    }
  })
  .post(
    Paths.defendantDateOfBirthPage.uri,
    FormValidator.requestHandler(DateOfBirth, DateOfBirth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DateOfBirth> = req.body
      const claim: Claim = res.locals.claim
      if (form.hasErrors()) {
        if (form.errors.some(error => error.message.search(dateUnder18Pattern) >= 0)) {
          res.redirect(Paths.under18Page.evaluateUri({ externalId: claim.externalId }))
        } else {
          renderView(form, res)
        }
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user
        switch (draft.document.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            (draft.document.defendantDetails.partyDetails as IndividualDetails).dateOfBirth = form.model
            break
          default:
            throw Error('Date of birth is only supported for defendant types individual and sole trader')
        }

        await new DraftService().save(draft, user.bearerToken)

        if (claim.claimData.defendant.phone === undefined) {
          res.redirect(Paths.defendantPhonePage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    }))
