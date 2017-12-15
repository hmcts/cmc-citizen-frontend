import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Claim } from 'claims/models/claim'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('response/guards/countyCourtJudgmentRequestedGuard')

export class CountyCourtJudgmentRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const claim: Claim = res.locals.claim
    if (claim.countyCourtJudgmentRequestedAt) {
      logger.warn('State guard: CCJ already requested - redirecting to dashboard')
      return res.redirect(DashboardPaths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
