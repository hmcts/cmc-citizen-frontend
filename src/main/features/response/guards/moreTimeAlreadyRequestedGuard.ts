import * as express from 'express'
import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'

export class MoreTimeAlreadyRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const claim: Claim = res.locals.claim

    if (claim.moreTimeRequested) {
      res.redirect(Paths.moreTimeConfirmationPage.evaluateUri({ externalId: claim.externalId }))
    } else {
      next()
    }
  }
}
