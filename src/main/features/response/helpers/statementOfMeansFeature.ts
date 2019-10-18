import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

export class StatementOfMeansFeature {
  static isApplicableFor (claim: Claim, draft: ResponseDraft): boolean {
    if (!ClaimFeatureToggles.isFeatureEnabledOnClaim(claim)) {
      return false
    }
    if (!draft) {
      throw new Error('Response draft is required')
    }
    const fullAdmissionHasStatementOfMeans = draft.isResponseFullyAdmittedWithPayBySetDate() || draft.isResponseFullyAdmittedWithInstalments()
    const parAdmissionHasStatementOfMeans = draft.isResponsePartiallyAdmittedWithPayBySetDate() || draft.isResponsePartiallyAdmittedWithInstalments()
    return (
        (draft.isResponseFullyAdmitted() && fullAdmissionHasStatementOfMeans)
        || (draft.isResponsePartiallyAdmitted() && parAdmissionHasStatementOfMeans)
      )
      && !draft.defendantDetails.partyDetails.isBusiness()
  }
}
