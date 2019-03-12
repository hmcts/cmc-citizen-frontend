import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('directions-questionnaire/guards/directionsQuestionnaireGuard')

export class DirectionsQuestionnaireGuard {
  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const claim: Claim = res.locals.claim
    if (claim.features.filter(feature => feature === 'directions_questionnaire').length === 0) {
      logger.warn('State guard: direction questionnaire feature not found - redirecting to dashboard')
      res.redirect(DashboardPaths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
