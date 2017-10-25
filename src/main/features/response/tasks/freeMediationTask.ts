import { ResponseDraft } from 'response/draft/responseDraft'

export class FreeMediationTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return !!(responseDraft.freeMediation && responseDraft.freeMediation.option)
  }
}
