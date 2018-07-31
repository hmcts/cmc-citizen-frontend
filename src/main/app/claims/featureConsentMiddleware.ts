import * as express from 'express'

import { User } from 'idam/user'
import { Logger } from '@hmcts/nodejs-logging'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Paths as AppPaths } from 'main/app/paths'

const logger = Logger.getLogger('middleware/authorization')

export class FeatureConsentMiddleware {

  static requestHandler (req: express.Request, res: express.Response): express.RequestHandler {

    const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

    return (req: express.Request, res: express.Response) => {

      const user: User = res.locals.user

      claimStoreClient.retrieveRoleNameByUserId(user).then(value => {
        if (value === null) {
          logger.debug('showing feature opt in page')
          res.redirect(AppPaths.featureOptInPage.uri)
        }
      })
    }
  }
}
