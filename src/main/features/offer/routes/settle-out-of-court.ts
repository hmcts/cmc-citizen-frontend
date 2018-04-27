import * as express from 'express'
import { Paths } from 'offer/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.settleOutOfCourtPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      res.render(Paths.settleOutOfCourtPage.associatedView, {
        claim: claim
      })
    }))
