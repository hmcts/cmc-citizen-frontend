import * as express from 'express'
import { plainToClass } from 'class-transformer'

import { Paths } from 'response/paths'
import { ErrorHandling } from 'common/errorHandling'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PartyType } from 'app/common/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'

import User from 'app/idam/user'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'

function renderView (form: Form<PartyDetails>, res: express.Response) {
  res.render(Paths.defendantYourDetailsPage.associatedView, {
    form: form
  })
}

function deserializeFn (value: any): PartyDetails {
  switch (value.type) {
    case PartyType.INDIVIDUAL.value:
      return IndividualDetails.fromObject(value)
    case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
      return SoleTraderDetails.fromObject(value)
    case PartyType.COMPANY.value:
      return CompanyDetails.fromObject(value)
    case PartyType.ORGANISATION.value:
      return OrganisationDetails.fromObject(value)
    default:
      throw new Error(`Unknown party type: ${value.type}`)
  }
}

export default express.Router()
  .get(Paths.defendantYourDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: User = res.locals.user

    const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(user.id)

    const partyDetails: PartyDetails = plainToClass(PartyDetails, claim.claimData.defendant)
    if (user.responseDraft.defendantDetails.partyDetails) {
      partyDetails.name = user.responseDraft.defendantDetails.partyDetails.name
      partyDetails.address = user.responseDraft.defendantDetails.partyDetails.address
      partyDetails.hasCorrespondenceAddress = user.responseDraft.defendantDetails.partyDetails.hasCorrespondenceAddress
      partyDetails.correspondenceAddress = user.responseDraft.defendantDetails.partyDetails.correspondenceAddress
    }

    renderView(new Form(partyDetails), res)
  }))
  .post(
    Paths.defendantYourDetailsPage.uri,
    FormValidator.requestHandler(PartyDetails, deserializeFn),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<PartyDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        user.responseDraft.defendantDetails.partyDetails = form.model
        await ResponseDraftMiddleware.save(res, next)

        switch (user.responseDraft.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.defendantDateOfBirthPage.uri)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          case PartyType.COMPANY.value:
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.defendantMobilePage.uri)
            break
          default:
            throw new Error(`Unknown party type: ${user.responseDraft.defendantDetails.partyDetails.type}`)
        }
      }
    }))
