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

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { SoleTrader } from 'claims/models/details/theirs/soleTrader'

function renderView (form: Form<PartyDetails>, res: express.Response) {
  const user: User = res.locals.user
  res.render(Paths.defendantYourDetailsPage.associatedView, {
    form: form,
    claim: user.claim
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

    const partyDetails: PartyDetails = plainToClass(PartyDetails, user.claim.claimData.defendant)
    if (user.responseDraft.defendantDetails.partyDetails) {
      switch (user.responseDraft.defendantDetails.partyDetails.type) {
        case PartyType.COMPANY.value:
          (partyDetails as CompanyDetails).contactPerson =
            (user.responseDraft.defendantDetails.partyDetails as CompanyDetails).contactPerson
          break
        case PartyType.ORGANISATION.value:
          (partyDetails as OrganisationDetails).contactPerson =
            (user.responseDraft.defendantDetails.partyDetails as OrganisationDetails).contactPerson
          break
        default:
          break
      }
      partyDetails.address = user.responseDraft.defendantDetails.partyDetails.address
      partyDetails.hasCorrespondenceAddress = user.responseDraft.defendantDetails.partyDetails.hasCorrespondenceAddress
      partyDetails.correspondenceAddress = user.responseDraft.defendantDetails.partyDetails.correspondenceAddress
    }

    renderView(new Form(partyDetails), res)
  }))
  .post(
    Paths.defendantYourDetailsPage.uri,
    FormValidator.requestHandler(PartyDetails, deserializeFn, 'response'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<PartyDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        const oldPartyDetails: PartyDetails = user.responseDraft.defendantDetails.partyDetails
        user.responseDraft.defendantDetails.partyDetails = form.model

        // Cache date of birth so we don't overwrite it
        if (oldPartyDetails && oldPartyDetails.type === PartyType.INDIVIDUAL.value && oldPartyDetails['dateOfBirth']) {
          (user.responseDraft.defendantDetails.partyDetails as IndividualDetails).dateOfBirth =
            (oldPartyDetails as IndividualDetails).dateOfBirth
        }

        // Store read only properties
        user.responseDraft.defendantDetails.partyDetails.name = user.claim.claimData.defendant.name
        if (user.claim.claimData.defendant.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
          (user.responseDraft.defendantDetails.partyDetails as SoleTraderDetails).businessName =
            (user.claim.claimData.defendant as SoleTrader).businessName
        }

        await ResponseDraftMiddleware.save(res, next)

        switch (user.responseDraft.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.defendantDateOfBirthPage.evaluateUri({ externalId: user.claim.externalId }))
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          case PartyType.COMPANY.value:
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.defendantMobilePage.evaluateUri({ externalId: user.claim.externalId }))
            break
          default:
            throw new Error(`Unknown party type: ${user.responseDraft.defendantDetails.partyDetails.type}`)
        }
      }
    }))
