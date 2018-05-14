import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { ForbiddenError } from 'errors'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'

export class OnlyClaimantLinkedToClaimCanDoIt {
  /**
   * Throws Forbidden error if user is not the claimant in the case
   *
   * @returns {express.RequestHandler} - request handler middleware
   */
  static check (): express.RequestHandler {
    return GuardFactory.create((res: express.Response) => {
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user
      return claim.claimantId === user.id
    }, (req: express.Request, res: express.Response): void => {
      throw new ForbiddenError()
    })
  }
}
