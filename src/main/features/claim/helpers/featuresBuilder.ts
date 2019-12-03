import { FeatureToggles } from 'utils/featureToggles'
import { FeatureTogglesClient } from 'shared/clients/featureTogglesClient'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const featureTogglesClient: FeatureTogglesClient = new FeatureTogglesClient()

export class FeaturesBuilder {
  static async features (draft: Draft<DraftClaim>, user: User): Promise<string> {
    const roles: string[] = await claimStoreClient.retrieveUserRoles(user)

    let features = ''
    if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_admissions')) {
      features = 'admissions'
    }

    const PILOT_AMOUNT = 300
    const ONLINE_DQ_THRESHOLD = 1000
    if (draft.document.amount.totalAmount() <= PILOT_AMOUNT) {
      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_mediation_pilot')) {
        features += features === '' ? 'mediationPilot' : ', mediationPilot'
      }

      if (await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_legal_advisor')) {
        features += features === '' ? 'LAPilotEligible' : ', LAPilotEligible'
      }
    }

    if (draft.document.amount.totalAmount() <= ONLINE_DQ_THRESHOLD) {
      if (FeatureToggles.isEnabled('directionsQuestionnaire') && await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_directions_questionnaire')) {
        features += features === '' ? 'directionsQuestionnaire' : ', directionsQuestionnaire'
      }
    }
    return (features === '') ? undefined : features
  }
}
