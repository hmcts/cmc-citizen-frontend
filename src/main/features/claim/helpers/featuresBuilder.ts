import { FeatureToggles } from 'utils/featureToggles'
import { FeatureTogglesClient } from 'shared/clients/featureTogglesClient'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const featureTogglesClient: FeatureTogglesClient = new FeatureTogglesClient()

export class FeaturesBuilder {
  static readonly MEDIATION_PILOT_AMOUNT = 500
  static readonly LA_PILOT_THRESHOLD = 300
  static readonly JUDGE_PILOT_THRESHOLD = 10000
  static readonly ONLINE_DQ_THRESHOLD = 10000

  static async features (amount: number, user: User): Promise<string> {
    const roles: string[] = await claimStoreClient.retrieveUserRoles(user)

    let features = ''
    if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_admissions')) {
      features = 'admissions'
    }

    if (amount <= this.MEDIATION_PILOT_AMOUNT) {
      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_mediation_pilot')) {
        features += features === '' ? 'mediationPilot' : ', mediationPilot'
      }
    }

    if (amount <= this.LA_PILOT_THRESHOLD) {
      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_legal_advisor')) {
        features += features === '' ? 'LAPilotEligible' : ', LAPilotEligible'
      }
    } else if (amount <= this.JUDGE_PILOT_THRESHOLD) {
      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_judge_pilot')) {
        features += features === '' ? 'judgePilotEligible' : ', judgePilotEligible'
      }
    }

    if (amount <= this.ONLINE_DQ_THRESHOLD) {
      if (FeatureToggles.isEnabled('directionsQuestionnaire') && await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_directions_questionnaire')) {
        features += features === '' ? 'directionsQuestionnaire' : ', directionsQuestionnaire'
      }
    }
    return (features === '') ? undefined : features
  }
}
