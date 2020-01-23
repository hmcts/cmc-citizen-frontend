import * as express from 'express'
import { Paths } from 'offer/paths'
import { User } from 'idam/user'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'offer/form/models/declaration'
import { Claim } from 'claims/models/claim'
import { OfferClient } from 'claims/offerClient'
import { OfferAcceptedGuard } from 'offer/guards/offerAcceptedGuard'
import { ClaimStatus } from 'claims/models/claimStatus'

function renderView (form: Form<Declaration>, res: express.Response) {
  const claim: Claim = res.locals.claim

  const user: User = res.locals.user
  res.render(
    Paths.declarationPage.associatedView,
    {
      claim: claim,
      form: form,
      offer: claim.status === ClaimStatus.CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT ? claim.settlement.getLastOffer() : claim.defendantOffer,
      isThroughAdmissions: claim.settlement && claim.settlement.isThroughAdmissions(),
      otherPartyName: user.id === claim.defendantId ? claim.claimData.claimant.name : claim.claimData.defendant.name
    }
  )
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.declarationPage.uri, OfferAcceptedGuard.check(),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        renderView(Form.empty(), res)
      }
    )
  )
  .post(
    Paths.declarationPage.uri, OfferAcceptedGuard.check(),
    FormValidator.requestHandler(Declaration, Declaration.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user

        if (user.id === claim.defendantId && claim.settlement.isOfferAccepted()) {
          await OfferClient.countersignOffer(claim.externalId, user)

          res.redirect(Paths.settledPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          await OfferClient.acceptOffer(claim.externalId, user)

          res.redirect(Paths.acceptedPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    }))
