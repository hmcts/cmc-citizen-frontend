import * as express from 'express'
import { ErrorPaths } from 'first-contact/paths'
import { User } from 'idam/user'

const logger = require('@hmcts/nodejs-logging').getLogger('first-contact/guards/claimReferenceMatchesGuard')

export class ClaimExpiredGuard {
  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const user: User = res.locals.user
    if (user.claim.countyCourtJudgmentRequestedAt !== undefined) {
      logger.error('Defendant cannot counter claim with a CCJ against them - redirect to request denied page ')
      res.redirect(ErrorPaths.ccjRequestedAccessDeniedPage.uri)
    } else {
      next()
    }
  }
}
