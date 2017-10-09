import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import User from 'idam/user'
const logger = require('@hmcts/nodejs-logging').getLogger('response/guards/countyCourtJudgmentRequestedGuard')

export class CountyCourtJudgmentRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const user: User = res.locals.user
    if (user.claim.countyCourtJudgmentRequestedAt) {
      logger.warn('State guard: CCJ already requested - redirecting to dashboard')
      return res.redirect(DashboardPaths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
