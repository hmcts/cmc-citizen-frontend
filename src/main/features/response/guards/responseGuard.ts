import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { Logger } from '@hmcts/nodejs-logging'

import { Claim } from 'claims/models/claim'
import { NotFoundError } from 'errors'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { YesNoOption } from 'models/yesNoOption'

const logger = Logger.getLogger('response/guards/responseGuard')

export class ResponseGuard {

  /**
   * Protects response journey from being accessed when response has been already submitted. Request in such scenario
   * will result in redirect to defendant dashboard. In opposite scenario where response has not been made yet,
   * the request will be processed.
   */
  static checkResponseDoesNotExist (): express.RequestHandler {
    const allowed = (res: express.Response) => {
      const claim: Claim = res.locals.claim
      return claim.response === undefined && claim.paperResponse !== YesNoOption.YES
    }
    const accessDeniedCallback = (req: express.Request, res: express.Response) => {
      logger.warn('State guard: response already exists - redirecting to dashboard')
      res.redirect(DashboardPaths.dashboardPage.uri)
    }
    return GuardFactory.create(allowed, accessDeniedCallback)
  }

  /**
   * Protects response journey from being accessed when response has not been submitted yet. Request in such scenario
   * will result in rendering not found page. In opposite scenario where response has already been made,
   * the request will be processed.
   */
  static checkResponseExists (): express.RequestHandler {
    const allowed = (res: express.Response) => {
      const claim: Claim = res.locals.claim
      return claim.response !== undefined
    }
    const accessDeniedCallback = (req: express.Request, res: express.Response) => {
      logger.warn('State guard: no response exists - rendering not found page')
      throw new NotFoundError(req.path)
    }
    return GuardFactory.create(allowed, accessDeniedCallback)
  }
}
