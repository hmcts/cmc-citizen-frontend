import * as express from 'express'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'app/claims/models/claim'
import { User } from 'idam/user'

import { UUIDUtils } from 'common/utils/uuidUtils'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

export class ClaimMiddleware {

  static retrieveByExternalId (req: express.Request, res: express.Response, next: express.NextFunction): void {
    // req.params isn't populated here https://github.com/expressjs/express/issues/2088
    const externalId: string = UUIDUtils.extractFrom(req.path)

    const user: User = res.locals.user
    claimStoreClient.retrieveByExternalId(externalId, user)
      .then((claim: Claim) => {
        res.locals.claim = claim
        next()
      })
      .catch(next)
  }
}
