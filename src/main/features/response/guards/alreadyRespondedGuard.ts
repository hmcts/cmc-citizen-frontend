import * as express from 'express'

import Claim from 'claims/models/claim'

import { Paths as DashboardPaths } from 'dashboard/paths'

/**
 * Protects response journey from being accessed when response has been already submitted. Request in such scenario
 * will result in redirect to defendant dashboard. In opposite scenario where response has not been made yet,
 * an attempt to display dashboard will result in redirect to the task list.
 */
export class AlreadyRespondedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.user.claim

    if (claim.response) {
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }
    next()
  }
}
