import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'

const logger = Logger.getLogger('offer/guards/offerAcceptedGuard')

export class OfferAcceptedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claim: Claim = res.locals.claim
    const user: User = res.locals.user

    if (claim.settlementReachedAt) {
      logger.debug('State guard: offer settlement reached, redirecting to dashboard')
      res.redirect(Paths.dashboardPage.uri)
    } else if (user.id === claim.claimantId && claim.settlement.isOfferResponded()) {
      logger.debug('State guard: offer already accepted, redirecting to dashboard')
      res.redirect(Paths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
