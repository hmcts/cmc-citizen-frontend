import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'

export class FeatureToggles {
  readonly claimStoreClient: ClaimStoreClient
  readonly launchDarklyClient: LaunchDarklyClient

  constructor (claimStoreClient: ClaimStoreClient, launchDarklyClient: LaunchDarklyClient) {
    this.claimStoreClient = claimStoreClient
    this.launchDarklyClient = launchDarklyClient
  }
  static isEnabled (featureName: string): boolean {
    return FeatureToggles.isAnyEnabled(featureName)
  }

  static hasAnyAuthorisedFeature (authorisedFeatures: string[], ...features: string[]): boolean {
    if (features.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }

    return features
      .some((feature) => FeatureToggles.isEnabled(feature)
        && authorisedFeatures !== undefined && authorisedFeatures.includes(feature))

  }

  static isAnyEnabled (...featureNames: string[]): boolean {
    if (featureNames.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }
    return featureNames
      .some((featureName) => toBoolean(config.get<boolean>(`featureToggles.${featureName}`)))
  }

  async isWarningBannerEnabled (toggle: string, user: User): Promise<boolean> {
    const roles: string[] = await this.claimStoreClient.retrieveUserRoles(user)
    return this.launchDarklyClient.variation(user, roles, toggle, true)
  }
}
