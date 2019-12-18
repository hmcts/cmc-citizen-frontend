import { FeatureToggles } from 'utils/featureToggles'
import { FeatureTogglesClient } from 'shared/clients/featureTogglesClient'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const featureTogglesClient: FeatureTogglesClient = new FeatureTogglesClient()

export class FeaturesBuilder {
  static readonly MEDIATION_PILOT_AMOUNT = 500
  static readonly PILOT_AMOUNT = 300
  static readonly ONLINE_DQ_THRESHOLD = 1000

  static async features (draft: Draft<DraftClaim>, user: User): Promise<string> {
    const roles: string[] = await claimStoreClient.retrieveUserRoles(user)

    let features = ''
    if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_admissions')) {
      features = 'admissions'
    }

    if (draft.document.amount.totalAmount() <= this.MEDIATION_PILOT_AMOUNT) {
      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_mediation_pilot')) {
        features += features === '' ? 'mediationPilot' : ', mediationPilot'
      }
    }

    if (draft.document.amount.totalAmount() <= this.PILOT_AMOUNT) {
      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_legal_advisor')) {
        features += features === '' ? 'LAPilotEligible' : ', LAPilotEligible'
      }
    }

    if (draft.document.amount.totalAmount() <= this.ONLINE_DQ_THRESHOLD) {
      if (FeatureToggles.isEnabled('directionsQuestionnaire') && await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_directions_questionnaire')) {
        features += features === '' ? 'directionsQuestionnaire' : ', directionsQuestionnaire'
      }

      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_judge_pilot')) {
        features += features === '' ? 'judgePilotEligible' : ', judgePilotEligible'
      }
    }
    return (features === '') ? undefined : features
  }
}
