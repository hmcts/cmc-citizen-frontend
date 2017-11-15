import * as express from 'express'
import { ErrorPaths } from 'first-contact/paths'
import { User } from 'idam/user'

const logger = require('@hmcts/nodejs-logging').getLogger('first-contact/guards/claimantRequestedCCJGuard')

export class ClaimantRequestedCCJGuard {
  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const user: User = res.locals.user
    if (user.claim.countyCourtJudgmentRequestedAt !== undefined) {
      logger.error('Defendant cannot respond to the claim with a CCJ against them - redirecting to handoff page. ')
      res.redirect(ErrorPaths.ccjRequestedHandoffPage.uri)
    } else {
      next()
    }
  }
}
