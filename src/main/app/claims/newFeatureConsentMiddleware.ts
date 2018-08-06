import * as express from 'express'

import { User } from 'idam/user'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Paths as ClaimPaths } from 'claim/paths'
import { FeatureToggles } from 'utils/featureToggles'

export class NewFeatureConsentMiddleware {

  static retrieveUserConsentRole (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!FeatureToggles.isEnabled('newFeaturesConsent')) {
      return next()
    }
    const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
    const user: User = res.locals.user
    claimStoreClient.retrieveUserRoles(user).then(value => {
      if (value.length === 0 && !value.includes('cmc-new-features-consent')) {
        res.redirect(ClaimPaths.newFeatureConsent.uri)
      } else {
        return next()
      }
    })
  }
}
