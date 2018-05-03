import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'

import { Claim } from 'claims/models/claim'
import { ForbiddenError } from 'errors'

export class OnlyDefendantCanDoItGuard {
  /**
   * Makes sure that current user is linked as a defendant to current claim.
   *
   * @returns {express.RequestHandler} - request handler middleware
   */
  static requestHandler (): express.RequestHandler {
    return GuardFactory.create((res: express.Response) => {

      const claim: Claim = res.locals.claim
      const user: User = res.locals.user

      if (!claim || !claim.defendantId || !user) {
        return false
      }

      return claim.defendantId === user.id
    }, (): void => {
      throw new ForbiddenError()
    })
  }
}
