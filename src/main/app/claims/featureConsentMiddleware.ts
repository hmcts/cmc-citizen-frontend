import * as express from 'express'

import { User } from 'idam/user'
import { Logger } from '@hmcts/nodejs-logging'
// import { ClaimStoreClient } from 'claims/claimStoreClient'
// import { Paths as AppPaths } from 'main/app/paths'

const logger = Logger.getLogger('middleware/featureConsent')

export class FeatureConsentMiddleware {

  static retrieveUserConsentRole (req: express.Request, res: express.Response, next: express.NextFunction): void {
    logger.info('inside featureConsentMiddleware')
    // const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
    const user: User = res.locals.user
    logger.info('user: ' + user)
    // claimStoreClient.retrieveRoleNameByUserId(user).then(value => {
    //   if (value.length === 0) {
    //     logger.info('showing feature opt in page')
    //     res.redirect(AppPaths.featureOptInPage.uri)
    //   } else {
    //     return next()
    //   }
    // })

  }
}
