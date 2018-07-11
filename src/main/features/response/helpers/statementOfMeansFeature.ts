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
    return (
      (draft.isResponseFullyAdmitted()
      && (draft.isResponseFullyAdmittedWithPayBySetDate() || draft.isResponseFullyAdmittedWithInstalments())
      )
      ||
      (
        draft.isResponsePartiallyAdmitted()
        && (draft.isResponsePartiallyAdmittedWithPayBySetDate() || draft.isResponsePartiallyAdmittedWithInstalments()))
      )
      && !draft.defendantDetails.partyDetails.isBusiness()
  }
}
