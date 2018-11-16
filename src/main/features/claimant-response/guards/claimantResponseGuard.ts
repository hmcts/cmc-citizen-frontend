import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { Logger } from '@hmcts/nodejs-logging'

import { Claim } from 'claims/models/claim'
import { Paths as DashboardPaths } from 'dashboard/paths'

const logger = Logger.getLogger('claimant-response/guards/claimantResponseGuard')

export class ClaimantResponseGuard {

  static checkClaimantResponseDoesNotExist (): express.RequestHandler {
    const allowed = (res: express.Response) => {
      const claim: Claim = res.locals.claim
      return claim.claimantResponse === undefined
    }
    const accessDeniedCallback = (req: express.Request, res: express.Response) => {
      logger.warn('State guard: claimant response already exists - redirecting to dashboard')
      res.redirect(DashboardPaths.dashboardPage.uri)
    }
    return GuardFactory.create(allowed, accessDeniedCallback)
  }
}
