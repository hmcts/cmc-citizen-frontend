import * as express from 'express'
import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'

export class MoreTimeRequestRequiredGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claim: Claim = res.locals.claim
    if (claim.moreTimeRequested) {
      next()
    } else {
      res.redirect(Paths.moreTimeRequestPage.evaluateUri({ externalId: claim.externalId }))
    }
  }

}
