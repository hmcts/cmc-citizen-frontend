import * as express from 'express'

import { User } from 'idam/user'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { FeatureToggles } from 'utils/featureToggles'
import { GuardFactory } from 'response/guards/guardFactory'
import { Paths as ClaimPaths } from 'claim/paths'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const claimStoreClient = new ClaimStoreClient()
const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

export class NewFeaturesConsentGuard {

  static requestHandler (): express.RequestHandler {
    return GuardFactory.createAsync(async (req: express.Request, res: express.Response) => {
      if (await featureToggles.isAutoEnrollIntoNewFeatureEnabled()) {
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
