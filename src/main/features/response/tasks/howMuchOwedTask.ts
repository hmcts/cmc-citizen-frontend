import { ResponseDraft } from 'response/draft/responseDraft'

export class HowMuchOwedTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {

    return (responseDraft.howMuchOwed.amount && responseDraft.howMuchOwed.text.length > 0)
  }
}
