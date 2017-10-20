import { ResponseDraft } from 'response/draft/responseDraft'

export class HowMuchPaidTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return (responseDraft.howMuchIsPaid.amount && responseDraft.howMuchIsPaid.text && responseDraft.howMuchIsPaid.isCompleted())
  }
}
