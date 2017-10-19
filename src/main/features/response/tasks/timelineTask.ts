import { ResponseDraft } from 'response/draft/responseDraft'

export class TimelineTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {

    return !!responseDraft.timeline && !!responseDraft.timeline.rows
  }
}
