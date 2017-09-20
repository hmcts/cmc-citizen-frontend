import { ResponseDraft } from 'response/draft/responseDraft'

export class HowMuchOwedTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!responseDraft.howMuchOwed.amount && responseDraft.howMuchOwed.text) {
      return false
    } else {
      return true
    }
  }}
