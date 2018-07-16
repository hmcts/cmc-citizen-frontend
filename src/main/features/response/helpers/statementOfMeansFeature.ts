import { FeatureToggles } from 'utils/featureToggles'

import { ResponseDraft } from 'response/draft/responseDraft'

export class StatementOfMeansFeature {
  static isApplicableFor (draft: ResponseDraft): boolean {
    if (!FeatureToggles.isEnabled('statementOfMeans')) {
      return false
    }
    if (!draft) {
      throw new Error('Response draft is required')
    }
    const fullAdmissionHasStatementOfMeans = draft.isResponseFullyAdmittedWithPayBySetDate() || draft.isResponseFullyAdmittedWithInstalments()
    const parAdmissionHasStatementOfMeans = draft.isResponsePartiallyAdmittedWithPayBySetDate() || draft.isResponsePartiallyAdmittedWithInstalments()
    return ((draft.isResponseFullyAdmitted() && fullAdmissionHasStatementOfMeans)
        || (draft.isResponsePartiallyAdmitted() && parAdmissionHasStatementOfMeans))
      && !draft.defendantDetails.partyDetails.isBusiness()
  }
}
