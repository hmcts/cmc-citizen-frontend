import { FeatureToggles } from 'utils/featureToggles'
import { Claim } from 'claims/models/claim'

export class ClaimFeatureToggles {
  static areAdmissionsEnabled (claim: Claim): boolean {
    return FeatureToggles.hasAnyAuthorisedFeature(claim.features, 'admissions')
  }
}
