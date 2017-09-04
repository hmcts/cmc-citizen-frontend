import * as express from 'express'

import { Paths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { Name } from 'app/forms/models/name'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'

import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { PartyType } from 'forms/models/partyType'
import { ErrorHandling } from 'common/errorHandling'
import User from 'app/idam/user'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'

async function getNameProvidedByClaimant (defendantId: number): Promise<string> {
  const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(defendantId)
  return claim.claimData.defendant.name
}

function renderView (form: Form<Name>, res: express.Response) {
  res.render(Paths.defendantYourDetailsPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantYourDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user: User = res.locals.user
      let nameProvidedByDefendant = null
      if (user.responseDraft.defendantDetails.partyDetails) {
        nameProvidedByDefendant = user.responseDraft.defendantDetails.partyDetails.name
      }
      const nameProvidedByClaimant = await getNameProvidedByClaimant(user.id)
      if (nameProvidedByDefendant == null) {
        renderView(new Form<Name>(new Name(nameProvidedByClaimant)), res)
      } else {
        renderView(new Form<Name>(new Name(nameProvidedByDefendant)), res)
      }
    } catch (err) {
      next(err)
    }
  })
  .post(
    Paths.defendantYourDetailsPage.uri,
    FormValidator.requestHandler(Name, Name.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Name> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user
        if (user.responseDraft.defendantDetails.partyDetails == null) {
          const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(user.id)
          switch (claim.claimData.defendant.type) {
            case PartyType.INDIVIDUAL.value:
              user.responseDraft.defendantDetails.partyDetails = new IndividualDetails()
              break
            case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
              user.responseDraft.defendantDetails.partyDetails = new SoleTraderDetails()
              break
            case PartyType.COMPANY.value:
              user.responseDraft.defendantDetails.partyDetails = new CompanyDetails()
              break
            case PartyType.ORGANISATION.value:
              user.responseDraft.defendantDetails.partyDetails = new OrganisationDetails()
              break
          }
        }
        res.locals.user.responseDraft.defendantDetails.partyDetails.name = form.model.name
        await ResponseDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantAddressPage.uri)
      }
    }))
