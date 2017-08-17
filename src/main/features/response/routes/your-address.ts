import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address as ProvidedAddress } from 'claims/models/address'
import { Address } from 'forms/models/address'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { PartyDetails } from 'forms/models/partyDetails'
import { ErrorHandling } from 'common/errorHandling'
import User from 'app/idam/user'

async function getAddressProvidedByClaimant (defendantId: number): Promise<ProvidedAddress> {
  const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(defendantId)
  return claim.claimData.defendant.address
}

function renderView (form: Form<PartyDetails>, res: express.Response) {
  res.render(Paths.defendantAddressPage.associatedView, {
    form: form
  })
}

function defaultToAddressProvidedByClaimant (providedByDefendant: PartyDetails, providedByClaimant: ProvidedAddress): PartyDetails {
  if (providedByDefendant.isCompleted()) {
    return providedByDefendant
  } else {
    return new PartyDetails(
      'name',
      new Address(
        providedByClaimant.line1,
        providedByClaimant.line2,
        providedByClaimant.city,
        providedByClaimant.postcode
      )
    )
  }
}

export default express.Router()
  .get(Paths.defendantAddressPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = res.locals.user
      const providedByDefendant: PartyDetails = user.responseDraft.defendantDetails.partyDetails
      const providedByClaimant: ProvidedAddress = await getAddressProvidedByClaimant(user.id)
      renderView(new Form(defaultToAddressProvidedByClaimant(providedByDefendant, providedByClaimant)), res)
    } catch (err) {
      next(err)
    }
  })
  .post(
    Paths.defendantAddressPage.uri,
    FormValidator.requestHandler(PartyDetails, PartyDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<PartyDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.responseDraft.defendantDetails.partyDetails = form.model

        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantDateOfBirthPage.uri)
      }
    }))
