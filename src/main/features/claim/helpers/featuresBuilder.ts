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
      if (feature.validForAmount(amount)) {
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
  validForAmount: (amount: number) => boolean
}

export const FEATURES: FeatureDefinition[] = [
  {
    feature: 'admissions',
    toggle: 'admissions',
    setting: 'admissions',
    validForAmount: () => true
  },
  {
    feature: 'mediationPilot',
    toggle: 'mediation_pilot',
    setting: 'mediationPilot',
    validForAmount: amount => amount <= FeaturesBuilder.MEDIATION_PILOT_AMOUNT
  },
  {
    feature: 'LAPilotEligible',
    toggle: 'legal_advisor_pilot',
    setting: 'legalAdvisorPilot',
    validForAmount: amount => amount <= FeaturesBuilder.LA_PILOT_THRESHOLD
  },
  {
    feature: 'judgePilotEligible',
    toggle: 'judge_pilot',
    setting: 'judgePilot',
    validForAmount: amount => amount > FeaturesBuilder.LA_PILOT_THRESHOLD && amount <= FeaturesBuilder.JUDGE_PILOT_THRESHOLD
  },
  {
    feature: 'directionsQuestionnaire',
    toggle: 'directions_questionnaire',
    setting: 'directionsQuestionnaire',
    validForAmount: amount => amount <= FeaturesBuilder.ONLINE_DQ_THRESHOLD
  },
  {
    feature: 'serviceSlowBanner',
    toggle: 'service_slow_banner',
    setting: 'serviceSlowBanner',
    validForAmount: () => true
  }
]
