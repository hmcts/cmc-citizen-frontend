import * as express from 'express'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

import { UUIDUtils } from 'shared/utils/uuidUtils'

export class ClaimMiddleware {

  static async retrieveByExternalId (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    // req.params isn't populated here https://github.com/expressjs/express/issues/2088
    const externalId: string = UUIDUtils.extractFrom(req.path)

    const user: User = res.locals.user
    try {
      const serviceAuthToken = await new ServiceAuthTokenFactoryImpl().get()
      const claimStoreClient = new ClaimStoreClient(undefined, serviceAuthToken)
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      res.locals.claim = claim
      next()
    } catch (error) {
      next(error)
    }
  }
}
