import * as express from 'express'

import { Claim } from 'claims/models/claim'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('response/guards/alreadyRespondedGuard')

/**
 * Protects response journey from being accessed when response has been already submitted. Request in such scenario
 * will result in redirect to defendant dashboard. In opposite scenario where response has not been made yet,
 * an attempt to display dashboard will result in redirect to the task list.
 */
export class AlreadyRespondedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim

    if (claim.response) {
      logger.warn('State guard: already responded - redirecting to dashboard')
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }
    next()
  }
}
