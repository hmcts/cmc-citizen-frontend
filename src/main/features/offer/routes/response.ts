import * as express from 'express'
import { FormValidator } from 'forms/validation/formValidator'
import { Paths } from 'offer/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Form } from 'forms/form'
import { DefendantResponse } from 'offer/form/models/defendantResponse'
import { Offer } from 'offer/form/models/offer'
import { PartyStatement } from 'app/claims/models/partyStatement'
import Claim from 'app/claims/models/claim'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { OfferGuard } from 'offer/guards/offerGuard'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'

function redirectToDashBoardPage (res: express.Response) {
  const user: User = res.locals.user
  res.redirect(DashboardPaths.claimantPage.evaluateUri({ externalId: user.claim.externalId }))
}
function getPartyStatement (claim: Claim, res: express.Response): PartyStatement[] {
  if (!claim.settlement || !claim.settlement.partyStatements) {
    redirectToDashBoardPage(res)
  }

  return claim.settlement.partyStatements.map(partyStatement => {
    if (partyStatement.type === StatementType.OFFER.value && partyStatement.madeBy === MadeBy.DEFENDANT.value) {
      return partyStatement
    }
  })
}
function getOffer (claim: any, res: express.Response): Offer {
  const partyStatements: any[] = getPartyStatement(claim, res)
  if (!partyStatements || partyStatements.length <= 0) {
    redirectToDashBoardPage(res)
  }
  return partyStatements[partyStatements.length - 1].offer
}
async function renderView (
  form: Form<DefendantResponse>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.responsePage.associatedView, {
    form: form,
    claim : res.locals.user.claim,
    offer: getOffer(res.locals.user.claim, res)
  })
}

export default express.Router()
  .get(
    Paths.responsePage.uri,
    OfferGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(Form.empty(), res, next)
    }))
  .post(
    Paths.responsePage.uri,
    OfferGuard.requestHandler,
    FormValidator.requestHandler(DefendantResponse, DefendantResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        res.redirect(Paths.responsePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    }))
