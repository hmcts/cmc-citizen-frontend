import { ResponseDraft } from 'response/draft/responseDraft'

export class HowMuchPaidTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!(responseDraft.howMuchIsPaid.amount || responseDraft.howMuchIsPaid.text || responseDraft.howMuchIsPaid.date)) {
      return false
    } else {
      return true
    }
  }}
