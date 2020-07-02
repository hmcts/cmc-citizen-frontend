import * as express from 'express'

import { User } from 'idam/user'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { FeatureToggles } from 'utils/featureToggles'
import { GuardFactory } from 'response/guards/guardFactory'
import { Paths as ClaimPaths } from 'claim/paths'

const claimStoreClient = new ClaimStoreClient()

export class NewFeaturesConsentGuard {

  static requestHandler (): express.RequestHandler {
    return GuardFactory.createAsync(async (req: express.Request, res: express.Response) => {
      if (FeatureToggles.isEnabled('autoEnrolIntoNewFeature')) {
        return true
      }
      if (!FeatureToggles.isEnabled('newFeaturesConsent')) {
        return true
      }

      const user: User = res.locals.user
      const roles = await claimStoreClient.retrieveUserRoles(user)

      return roles.length !== 0 && roles.some(role => role.includes('cmc-new-features-consent'))
    }, (req: express.Request, res: express.Response): void => {
      res.redirect(ClaimPaths.newFeaturesConsentPage.uri)
    })
  }
}
