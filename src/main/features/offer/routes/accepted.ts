import * as express from 'express'
import { Paths } from 'offer/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.acceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      res.render(Paths.acceptedPage.associatedView, {
        claim: claim,
        agreementLink: Paths.agreementReceiver.evaluateUri({ externalId: claim.externalId })
      })
    }))
