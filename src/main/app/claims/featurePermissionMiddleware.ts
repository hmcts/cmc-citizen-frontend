import * as express from 'express'

import { User } from 'idam/user'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Paths as ClaimPaths } from 'claim/paths'

export class FeaturePermissionMiddleware {

  static retrieveUserConsentRole (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
    const user: User = res.locals.user
    claimStoreClient.retrieveRoleNameByUserId(user).then(value => {
      if (value.length === 0) {
        res.redirect(ClaimPaths.featurePermissionPage.uri)
      } else {
        return next()
      }
    })
  }
}
