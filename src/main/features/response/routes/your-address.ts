import * as express from 'express'

import { Paths } from 'response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address as ProvidedAddress } from 'claims/models/address'
import { Address } from 'forms/models/address'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { AddressDetails } from 'forms/models/addressDetails'
import { PartyType } from 'forms/models/partyType'
import { ErrorHandling } from 'common/errorHandling'
import User from 'app/idam/user'

async function getAddressProvidedByClaimant (defendantId: number): Promise<ProvidedAddress> {
  const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(defendantId)
  return claim.claimData.defendant.address
}

function renderView (form: Form<AddressDetails>, res: express.Response) {
  res.render(Paths.defendantAddressPage.associatedView, {
    form: form
  })
}

function defaultToAddressProvidedByClaimant (providedByDefendant: AddressDetails, providedByClaimant: ProvidedAddress): AddressDetails {
  if (providedByDefendant.isCompleted()) {
    return providedByDefendant
  } else {
    return new AddressDetails(
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
      const providedByDefendant: AddressDetails = user.responseDraft.defendantDetails.partyDetails
      const providedByClaimant: ProvidedAddress = await getAddressProvidedByClaimant(user.id)
      renderView(new Form(defaultToAddressProvidedByClaimant(providedByDefendant, providedByClaimant)), res)
    } catch (err) {
      next(err)
    }
  })
  .post(
    Paths.defendantAddressPage.uri,
    FormValidator.requestHandler(AddressDetails, AddressDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<AddressDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.responseDraft.defendantDetails.partyDetails.address = form.model.address
        res.locals.user.responseDraft.defendantDetails.partyDetails.hasCorrespondenceAddress = form.model.hasCorrespondenceAddress
        res.locals.user.responseDraft.defendantDetails.partyDetails.correspondenceAddress = form.model.correspondenceAddress

        await ResponseDraftMiddleware.save(res, next)
        switch (res.locals.user.responseDraft.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.defendantDateOfBirthPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            res.redirect(Paths.defendantDateOfBirthPage.uri)
            break
          case PartyType.COMPANY.value:
            res.redirect(Paths.defendantMobilePage.uri)
            break
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.defendantMobilePage.uri)
            break
          default:
            throw new Error()
        }
      }
    }))
