import * as express from 'express'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'app/claims/models/claim'
import { User } from 'idam/user'

import { UUIDUtils } from 'common/utils/uuidUtils'

export class ClaimMiddleware {

  static retrieveByExternalId (req: express.Request, res: express.Response, next: express.NextFunction): void {
    // req.params isn't populated here https://github.com/expressjs/express/issues/2088
    const externalId: string = UUIDUtils.extractFrom(req.path)

    const user: User = res.locals.user
    ClaimStoreClient.retrieveByExternalId(externalId, user.id)
      .then((claim: Claim) => {
        user.claim = claim
        next()
      })
      .catch(next)
  }
}
