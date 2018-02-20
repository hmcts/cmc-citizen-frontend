import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { ForbiddenError } from '../../errors'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'
import { FeatureToggles } from 'utils/featureToggles'

export class IsDefendantInCaseGuard {
  /**
   * Throws Forbidden error if user is not defendant in the case
   *
   * @returns {express.RequestHandler} - request handler middleware
   */
  static check (): express.RequestHandler {
    return GuardFactory.create((res: express.Response) => {
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user
      if (!FeatureToggles.isEnabled('ccd')) { // CCD does authorisation checks for us
        return claim.defendantId === user.id
      }
      return true
    }, (req: express.Request, res: express.Response): void => {
      throw new ForbiddenError()
    })
  }
}
