import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

export class FeatureToggles {
  readonly launchDarklyClient: LaunchDarklyClient

  constructor (launchDarklyClient: LaunchDarklyClient) {
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

  async isWarningBannerEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('warning_banner', toBoolean(config.get<boolean>(`featureToggles.warningBanner`)))
  }

  async isHelpWithFeesEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('help-with-fees', toBoolean(config.get<boolean>(`featureToggles.helpWithFees`)))
  }

  async isPcqEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('pcq', toBoolean(config.get<boolean>(`featureToggles.pcq`)))
  }

  async isSignPostingEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('sign-posting-ctsc', toBoolean(config.get<boolean>(`featureToggles.signPostingCTSC`)))
  }

  async isAutoEnrollIntoNewFeatureEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('auto-enroll-into-new-feature', toBoolean(config.get<boolean>(`featureToggles.autoEnrollIntoNewFeature`)))
  }

  async isDashboardPaginationEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('dashboard_pagination_enabled', toBoolean(config.get<boolean>(`featureToggles.pagination`)))
  }

}
