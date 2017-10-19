import { ResponseDraft } from 'response/draft/responseDraft'

export class TimelineTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {

    if (!responseDraft.timeline) {
      return false
    }

    responseDraft.timeline.removeExcessRows()

    return responseDraft.timeline.rows.length > 0 && !!responseDraft.timeline.rows[0].date
  }
}
