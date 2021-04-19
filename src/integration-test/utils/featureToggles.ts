import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

export class FeatureToggles {
  readonly launchDarklyClient: LaunchDarklyClient

  constructor (launchDarklyClient: LaunchDarklyClient) {
    this.launchDarklyClient = launchDarklyClient
  }

  async isEnhancedMediationJourneyEnabled (): Promise<boolean> {
    return this.launchDarklyClient.serviceVariation('enhanced-mediation-journey', toBoolean(config.get<boolean>(`featureToggles.enhancedMediationJourney`)))
  }
}
