import { FeatureToggles } from 'utils/featureToggles'

import { ResponseDraft } from 'response/draft/responseDraft'

export class StatementOfMeansFeature {
  static isApplicableFor (features: string[], draft: ResponseDraft): boolean {
    if (!FeatureToggles.hasAnyAuthorisedFeature(features,'admissions')) {
      return false
    }
    if (!draft) {
      throw new Error('Response draft is required')
    }
    const fullAdmissionHasStatementOfMeans = draft.isResponseFullyAdmittedWithPayBySetDate() || draft.isResponseFullyAdmittedWithInstalments(features)
    const parAdmissionHasStatementOfMeans = draft.isResponsePartiallyAdmittedWithPayBySetDate() || draft.isResponsePartiallyAdmittedWithInstalments(features)
    return (
        (draft.isResponseFullyAdmitted(features) && fullAdmissionHasStatementOfMeans)
        || (draft.isResponsePartiallyAdmitted(features) && parAdmissionHasStatementOfMeans)
      )
      && !draft.defendantDetails.partyDetails.isBusiness()
  }
}
