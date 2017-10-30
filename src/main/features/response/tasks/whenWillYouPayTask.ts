import { ResponseDraft } from 'response/draft/responseDraft'

export class WhenWillYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return !!(responseDraft.defendantPaymentOption && responseDraft.defendantPaymentOption.option)
  }
}
