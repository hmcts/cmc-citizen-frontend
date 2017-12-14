import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'

const logger = require('@hmcts/nodejs-logging').getLogger('ccj/guards/ccjGuard')

export class CCJGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim

    if (!claim.eligibleForCCJ) {
      logger.warn(`Claim ${claim.claimNumber} not eligible for a CCJ - redirecting to dashboard page`)
      res.redirect(Paths.dashboardPage.uri)
    } else {
      next()
    }
  }

}
