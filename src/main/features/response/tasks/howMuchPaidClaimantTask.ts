import { ResponseDraft } from 'response/draft/responseDraft'

export class HowMuchPaidClaimantTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return !!(responseDraft.howMuchPaidClaimant && responseDraft.howMuchPaidClaimant.option)
  }
}
