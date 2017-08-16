import { ResponseDraft } from 'response/draft/responseDraft'

export class YourDefenceTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    if (!(responseDraft.defence && responseDraft.defence.text)) {
      return false
    }
    return !!(responseDraft.freeMediation && responseDraft.freeMediation.option)
  }
}
