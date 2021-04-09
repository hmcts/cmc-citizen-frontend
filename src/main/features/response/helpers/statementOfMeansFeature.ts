import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'

export class StatementOfMeansFeature {
  static isApplicableFor (claim: Claim, draft: ResponseDraft): boolean {
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
