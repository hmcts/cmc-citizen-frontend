import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { User } from 'idam/user'
import * as DirectionsQuestionnaireHelper from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'

const logger = Logger.getLogger('directions-questionnaire/guards/exceptionalCircumstancesGuard')

export class ExceptionalCircumstancesGuard {
  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const claim: Claim = res.locals.claim
    const user: User = res.locals.user
    if (DirectionsQuestionnaireHelper.getUsersRole(claim, user) === DirectionsQuestionnaireHelper.getPreferredParty(claim)) {
      logger.info('State guard: user is preferred party in court hearing location - redirecting to dashboard')
      res.redirect(DashboardPaths.dashboardPage.uri)
    } else {
      next()
    }
  }
}
