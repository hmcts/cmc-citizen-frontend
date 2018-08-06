import * as express from 'express'

import { User } from 'idam/user'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Paths as ClaimPaths } from 'claim/paths'
import * as toBoolean from 'to-boolean'
import * as config from 'config'

export class FeaturePermissionMiddleware {

  static retrieveUserConsentRole (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!toBoolean(config.get<boolean>('featureToggles.featuresPermission'))) {
      return next()
    }
    const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
    const user: User = res.locals.user
    claimStoreClient.retrieveUserRoles(user).then(value => {
      if (value.length === 0) {
        res.redirect(ClaimPaths.featurePermissionPage.uri)
      } else {
        return next()
      }
    })
  }
}
