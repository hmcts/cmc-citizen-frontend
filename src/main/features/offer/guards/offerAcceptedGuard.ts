import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { Claim } from 'claims/models/claim'

const logger = Logger.getLogger('offer/guards/offerAcceptedGuard')

export class OfferAcceptedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claim: Claim = res.locals.claim

    if (claim.settlement.isOfferAccepted()) {
      logger.debug('State guard: offer already accepted, redirecting to dashboard')
      res.redirect(Paths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
