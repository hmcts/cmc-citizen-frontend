import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('claimant-response/guards/ClaimantResponseGuard')

export class ClaimantResponseGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim

    if (!claim.response) {
      logger.warn(`Claim ${claim.claimNumber} not have a response from defendant - redirecting to dashboard page`)
      res.redirect(Paths.dashboardPage.uri)
    } else {
      next()
    }
  }

}
