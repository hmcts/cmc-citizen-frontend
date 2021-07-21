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

  async isAntennaWebChatEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('antenna-web-chat', toBoolean(config.get<boolean>(`featureToggles.AntennawebChat`)))
  }

  async isSignPostingEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('sign-posting-ctsc', toBoolean(config.get<boolean>(`featureToggles.signPostingCTSC`)))
  }

  async isDashboardPaginationEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('dashboard_pagination_enabled', toBoolean(config.get<boolean>(`featureToggles.dashboard_pagination_enabled`)))
  }

  async isOCONEnhancementEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('ocon-enhancement-2', toBoolean(config.get<boolean>(`featureToggles.oconEnhancements`)))
  }

  async isEnhancedMediationJourneyEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('enhanced-mediation-journey', toBoolean(config.get<boolean>(`featureToggles.enhancedMediationJourney`)))
  }

  async isBreathingSpaceEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('breathing-space', toBoolean(config.get<boolean>(`featureToggles.breathingSpace`)))
  }

  async isNewClaimFeesEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('new-claim-fees', toBoolean(config.get<boolean>(`featureToggles.newClaimFees`)))
  }
}
