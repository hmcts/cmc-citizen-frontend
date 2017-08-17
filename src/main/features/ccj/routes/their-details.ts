import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { PartyDetails } from 'app/forms/models/partyDetails'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Form } from 'app/forms/form'
import User from 'app/idam/user'
import { DraftCCJService } from 'ccj/draft/DraftCCJService'
import { Address } from 'forms/models/address'

function defaultToAddressProvidedByClaimant (providedByDefendant: PartyDetails, providedByClaimant: Address): PartyDetails {
  if (providedByDefendant.isCompleted()) {
    return providedByDefendant
  } else {
    return new PartyDetails(providedByClaimant)
  }
}


function renderView (form: Form<PartyDetails>, res: express.Response): void {
  res.render(Paths.theirDetailsPage.associatedView, { form: form, claim: res.locals.user.claim })
}

export default express.Router()
  .get(Paths.theirDetailsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      const providedByDefendant: PartyDetails = user.ccjDraft.defendant.partyDetails
      const providedByClaimant: Address = Address.fromClaimAddress(user.claim.claimData.defendant.address)

      renderView(new Form(defaultToAddressProvidedByClaimant(providedByDefendant, providedByClaimant)), res)
    }))

  .post(Paths.theirDetailsPage.uri,
    FormValidator.requestHandler(PartyDetails, PartyDetails.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<PartyDetails> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          user.ccjDraft.defendant.partyDetails = form.model
          await DraftCCJService.save(res, next)
          res.redirect('todo')
        }
      }))
