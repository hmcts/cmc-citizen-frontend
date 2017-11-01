import * as express from 'express'
import { FormValidator } from 'forms/validation/formValidator'
import { Paths } from 'offer/paths'
import { Form } from 'forms/form'
import { DefendantResponse } from 'offer/form/models/defendantResponse'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { OfferGuard } from 'offer/guards/offerGuard'

function getPartyStatement (claim: any): any[] {
  if (!claim.settlement || !claim.settlement.partyStatements) {
    throw Error('Something went wrong, No offer present')
  }

  return claim.settlement.partyStatements.map(partyStatement => {
    if (partyStatement.type === 'OFFER' && partyStatement.madeBy === 'DEFENDANT') {
      return partyStatement
    }
  })
}
function getOffer (claim: any): any[] {
  const partyStatements: any[] = getPartyStatement(claim)
  if (!partyStatements || partyStatements.length <= 0) {
    throw Error('Something went wrong, No offer present')
  }
  return partyStatements[partyStatements.length - 1].offer
}
async function renderView (
  form: Form<DefendantResponse>, res: express.Response, next: express.NextFunction) {
  res.render(Paths.responsePage.associatedView, {
    form: form,
    claim : res.locals.user.claim,
    offer: getOffer(res.locals.user.claim)
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
