import * as express from 'express'
import { FormValidator } from 'forms/validation/formValidator'
import { Paths } from 'offer/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Form } from 'forms/form'
import { DefendantResponse } from 'offer/form/models/defendantResponse'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { StatementType } from 'offer/form/models/statementType'
import { OfferClient } from 'claims/offerClient'
import { Claim } from 'claims/models/claim'
import { Offer } from 'claims/models/offer'

function renderView (form: Form<DefendantResponse>, res: express.Response, next: express.NextFunction) {
  const claim: Claim = res.locals.claim
  const offer: Offer = claim.defendantOffer
  if (!offer) {
    const responseClaim: Claim = res.locals.claim
    res.redirect(DashboardPaths.claimantPage.evaluateUri({ externalId: responseClaim.externalId }))
  } else {
    res.render(Paths.responsePage.associatedView, {
      form: form,
      claim: claim,
      offer: offer
    })
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.responsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(Form.empty(), res, next)
    }))
  .post(
    Paths.responsePage.uri,
    FormValidator.requestHandler(DefendantResponse, DefendantResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user
        switch (form.model.option) {
          case StatementType.ACCEPTATION:
            res.redirect(Paths.makeAgreementPage.evaluateUri({ externalId: claim.externalId }))
            break
          case StatementType.REJECTION:
            await OfferClient.rejectOffer(claim.externalId, user)
            res.redirect(Paths.rejectedPage.evaluateUri({ externalId: claim.externalId }))
            break
          default:
            throw new Error(`Option ${form.model.option} is not supported`)
        }
      }
    }))
