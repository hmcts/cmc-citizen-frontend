import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

export class ViewDefendantResponse {

  static isCompleted (response: DraftClaimantResponse): boolean {
    return response.defendantResponseViewed
  }
}
