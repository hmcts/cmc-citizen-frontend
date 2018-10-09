import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'

const logger = Logger.getLogger('offer/guards/offerAcceptedGuard')

export class OfferAcceptedGuard {

  static check (): express.RequestHandler {
    return GuardFactory.create((res: express.Response) => {
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user

      if (claim.settlementReachedAt) {
        logger.warn('State guard: offer settlement reached, redirecting to dashboard')
        return false
      } else if (user.id === claim.claimantId && claim.claimantId !== claim.defendantId
                && claim.settlement.isOfferResponded()) {
        logger.warn('State guard: offer already accepted, redirecting to dashboard')
        return false
      } else {
        return true
      }
    }, (req: express.Request, res: express.Response) => {
      res.redirect(Paths.dashboardPage.uri)
    })
  }
}
