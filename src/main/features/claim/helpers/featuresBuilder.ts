import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import * as config from 'config'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const launchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()

export class FeaturesBuilder {
  static readonly MEDIATION_PILOT_AMOUNT = 500
  static readonly LA_PILOT_THRESHOLD = 300
  static readonly JUDGE_PILOT_THRESHOLD = 1000
  static readonly ONLINE_DQ_THRESHOLD = 10000

  static async features (amount: number, user: User): Promise<string> {
    const roles: string[] = await claimStoreClient.retrieveUserRoles(user)

    let features = []
    for (const featureDef of FEATURES) {
      if (amount <= featureDef.threshold) {
        const ldVariation = await launchDarklyClient.variation(user, roles, featureDef.toggle)
        if (ldVariation || (ldVariation === undefined && config.get<string>(`featureToggles.${featureDef.setting}`))) {
          features.push(featureDef.feature)
        }
      }
    }
    return features.length === 0 ? undefined : features.join(', ')
  }
}

type FeatureDefinition = {
  feature: string
  toggle: string
  setting: string
  threshold: number
}

const FEATURES: FeatureDefinition[] = [
  {
    feature: 'admissions',
    toggle: 'admissions',
    setting: 'admissions',
    threshold: Number.MAX_VALUE
  },
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
