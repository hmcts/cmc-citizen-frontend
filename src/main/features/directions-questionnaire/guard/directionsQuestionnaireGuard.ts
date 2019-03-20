import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

const logger = Logger.getLogger('directions-questionnaire/guards/directionsQuestionnaireGuard')

export class DirectionsQuestionnaireGuard {
  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const claim: Claim = res.locals.claim
    if (!ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
      logger.warn('State guard: direction questionnaire feature not found - redirecting to dashboard')
      res.redirect(DashboardPaths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
