import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import * as config from 'config'

export class FeaturesBuilder {
  static readonly MEDIATION_PILOT_AMOUNT = 500
  static readonly LA_PILOT_THRESHOLD = 300
  static readonly JUDGE_PILOT_THRESHOLD = 10000
  static readonly ONLINE_DQ_THRESHOLD = 10000

  readonly claimStoreClient: ClaimStoreClient
  readonly launchDarklyClient: LaunchDarklyClient

  constructor (claimStoreClient: ClaimStoreClient, launchDarklyClient: LaunchDarklyClient) {
    this.claimStoreClient = claimStoreClient
    this.launchDarklyClient = launchDarklyClient
  }

  async features (amount: number, user: User): Promise<string> {
    const roles: string[] = await this.claimStoreClient.retrieveUserRoles(user)
    if (!roles.includes('cmc-new-features-consent-given')) {
      // all features require consent
      return undefined
    }

    let features = []
    for (const feature of FEATURES) {
      if (amount <= feature.threshold) {
        const offlineDefault = config.get<boolean>(`featureToggles.${feature.setting}`) || false
        const ldVariation = await this.launchDarklyClient.variation(user, roles, feature.toggle, offlineDefault)
        if (ldVariation) {
          features.push(feature.feature)
        }
      }
    }
    return (!features || features.length === 0) ? undefined : features.join(', ')
  }
}

type FeatureDefinition = {
  feature: string
  toggle: string
  setting: string
  threshold: number
}

export const FEATURES: FeatureDefinition[] = [
  {
    feature: 'mediationPilot',
    toggle: 'mediation_pilot',
    setting: 'mediationPilot',
    threshold: FeaturesBuilder.MEDIATION_PILOT_AMOUNT
  },
  {
    feature: 'LAPilotEligible',
    toggle: 'legal_advisor_pilot',
    setting: 'legalAdvisorPilot',
    threshold: FeaturesBuilder.LA_PILOT_THRESHOLD
  },
  {
    feature: 'judgePilotEligible',
    toggle: 'judge_pilot',
    setting: 'judgePilot',
    threshold: FeaturesBuilder.JUDGE_PILOT_THRESHOLD
  },
  {
    feature: 'directionsQuestionnaire',
    toggle: 'directions_questionnaire',
    setting: 'directionsQuestionnaire',
    threshold: FeaturesBuilder.ONLINE_DQ_THRESHOLD
  }
]
