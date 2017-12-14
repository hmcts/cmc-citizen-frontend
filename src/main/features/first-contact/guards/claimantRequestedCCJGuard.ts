import * as express from 'express'
import { ErrorPaths } from 'first-contact/paths'
import { Claim } from 'claims/models/claim'

const logger = require('@hmcts/nodejs-logging').getLogger('first-contact/guards/claimantRequestedCCJGuard')

export class ClaimantRequestedCCJGuard {
  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim
    if (claim.countyCourtJudgmentRequestedAt !== undefined) {
      logger.error('Defendant cannot respond to the claim with a CCJ against them - redirecting to handoff page. ')
      res.redirect(ErrorPaths.ccjRequestedHandoffPage.uri)
    } else {
      next()
    }
  }
}
