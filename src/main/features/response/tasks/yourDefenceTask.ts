import { ResponseDraft } from 'response/draft/responseDraft'

export class YourDefenceTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return !!(responseDraft.defence && responseDraft.defence.text)
  }
}
