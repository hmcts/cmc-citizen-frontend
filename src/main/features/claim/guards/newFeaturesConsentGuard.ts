import * as express from 'express'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { ForbiddenError } from 'errors'

const claimStoreClient = new ClaimStoreClient()

export class NewFeaturesConsentGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    claimStoreClient.retrieveUserRoles(res.locals.user)
      .then(roles => {
        if (roles.length !== 0 && roles.some(role => role.includes('cmc-new-features-consent'))) {
          return res.render(new ForbiddenError().associatedView)
        } else {
          next()
        }
      })
  }
}
