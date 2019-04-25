import { FeatureToggles } from 'utils/featureToggles'
import { Claim } from 'claims/models/claim'

export class ClaimFeatureToggles {
  static isFeatureEnabledOnClaim (claim: Claim, feature: string = 'admissions'): boolean {
    return FeatureToggles.hasAnyAuthorisedFeature(claim.features, feature)
  }
}
