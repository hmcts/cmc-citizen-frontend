import { ResponseDraft } from 'response/draft/responseDraft'

export class ViewSendCompanyFinancialDetailsTask {

  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.companyDefendantResponseViewed = true
  }
}
