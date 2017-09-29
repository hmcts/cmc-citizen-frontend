import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { PartyDetails } from 'app/forms/models/partyDetails'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Form } from 'app/forms/form'
import User from 'app/idam/user'
import { DraftCCJService } from 'ccj/draft/DraftCCJService'
import { Address } from 'forms/models/address'
import { PartyDetailsFactory } from 'forms/models/partyDetailsFactory'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { PartyType } from 'app/common/partyType'
import Email from 'forms/models/email'

function defaultToAddressProvidedByClaimant (providedByDefendant: Address, providedByClaimant: Address): Address {
  if (providedByDefendant && providedByDefendant.isCompleted()) {
    return providedByDefendant
  } else {
    return providedByClaimant
  }
}

function convertToPartyDetails (value: TheirDetails): PartyDetails {
  const partyDetails = PartyDetailsFactory.createInstance(value.type)
  partyDetails.deserialize(value)
  return partyDetails
}

function renderView (form: Form<PartyDetails>, res: express.Response): void {
  res.render(Paths.theirDetailsPage.associatedView, { form: form, claim: res.locals.user.claim })
}

export default express.Router()
  .get(Paths.theirDetailsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      const providedByDefendant: Address = user.ccjDraft.defendant.partyDetails !== undefined ? user.ccjDraft.defendant.partyDetails.address : undefined
      const providedByClaimant: Address = Address.fromClaimAddress(user.claim.claimData.defendant.address)

      renderView(new Form(defaultToAddressProvidedByClaimant(providedByDefendant, providedByClaimant)), res)
    }))

  .post(Paths.theirDetailsPage.uri,
    FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<PartyDetails> = req.body
        const user: User = res.locals.user
        const { externalId } = req.params

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          if (user.ccjDraft.defendant.partyDetails === undefined) {
            user.ccjDraft.defendant.partyDetails = convertToPartyDetails(user.claim.claimData.defendant)
            user.ccjDraft.defendant.email = new Email(user.claim.claimData.defendant.email)
          }
          user.ccjDraft.defendant.partyDetails.address = form.model
          await DraftCCJService.save(res, next)
          if (user.ccjDraft.defendant.partyDetails.type === PartyType.INDIVIDUAL.value) {
            res.redirect(Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(Paths.paidAmountPage.evaluateUri({ externalId: externalId }))
          }
        }
      }))
