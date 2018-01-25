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

import { User } from 'app/idam/user'

import { SoleTrader } from 'claims/models/details/theirs/soleTrader'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { Country } from 'app/common/country'

function renderView (form: Form<PartyDetails>, res: express.Response) {
  const claim: Claim = res.locals.claim

  res.render(Paths.defendantYourDetailsPage.associatedView, {
    form: form,
    claim: claim
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

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defendantYourDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    const claim: Claim = res.locals.claim

    const partyDetails: PartyDetails = plainToClass(PartyDetails, claim.claimData.defendant)
    if (draft.document.defendantDetails.partyDetails) {
      switch (draft.document.defendantDetails.partyDetails.type) {
        case PartyType.COMPANY.value:
          (partyDetails as CompanyDetails).contactPerson =
            (draft.document.defendantDetails.partyDetails as CompanyDetails).contactPerson
          break
        case PartyType.ORGANISATION.value:
          (partyDetails as OrganisationDetails).contactPerson =
            (draft.document.defendantDetails.partyDetails as OrganisationDetails).contactPerson
          break
        default:
          break
      }
      partyDetails.address = draft.document.defendantDetails.partyDetails.address
      partyDetails.hasCorrespondenceAddress = draft.document.defendantDetails.partyDetails.hasCorrespondenceAddress
      partyDetails.correspondenceAddress = draft.document.defendantDetails.partyDetails.correspondenceAddress
    }

    renderView(new Form(partyDetails), res)
  }))
  .post(
    Paths.defendantYourDetailsPage.uri,
    FormValidator.requestHandler(PartyDetails, deserializeFn, 'response'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      let form: Form<PartyDetails> = req.body
      form = Country.isValidDefendantAddress(form)

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user
        const oldPartyDetails: PartyDetails = draft.document.defendantDetails.partyDetails
        draft.document.defendantDetails.partyDetails = form.model

        // Cache date of birth so we don't overwrite it
        if (oldPartyDetails && oldPartyDetails.type === PartyType.INDIVIDUAL.value && oldPartyDetails['dateOfBirth']) {
          (draft.document.defendantDetails.partyDetails as IndividualDetails).dateOfBirth =
            (oldPartyDetails as IndividualDetails).dateOfBirth
        }

        // Store read only properties
        draft.document.defendantDetails.partyDetails.name = claim.claimData.defendant.name
        if (claim.claimData.defendant.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
          (draft.document.defendantDetails.partyDetails as SoleTraderDetails).businessName =
            (claim.claimData.defendant as SoleTrader).businessName
        }

        await new DraftService().save(draft, user.bearerToken)

        switch (draft.document.defendantDetails.partyDetails.type) {
          case PartyType.INDIVIDUAL.value:
            res.redirect(Paths.defendantDateOfBirthPage.evaluateUri({ externalId: claim.externalId }))
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          case PartyType.COMPANY.value:
          case PartyType.ORGANISATION.value:
            res.redirect(Paths.defendantMobilePage.evaluateUri({ externalId: claim.externalId }))
            break
          default:
            throw new Error(`Unknown party type: ${draft.document.defendantDetails.partyDetails.type}`)
        }
      }
    }))
