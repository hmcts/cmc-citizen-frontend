import { ResponseDraft } from 'response/draft/responseDraft'

export class ViewSendCompanyFinancialDetailsTask {

  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft || !responseDraft.companyDefendantResponseViewed) {
      return false
    }
    return responseDraft.companyDefendantResponseViewed === true
  }
}
