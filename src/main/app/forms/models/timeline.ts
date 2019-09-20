import { MultiRowForm } from 'forms/models/multiRowForm'
import { TimelineRow } from 'forms/models/timelineRow'

export const INIT_ROW_COUNT: number = 4
export const MAX_ROW_COUNT: number = 100

export class Timeline extends MultiRowForm<TimelineRow> {

  static fromObject (value?: any): Timeline {
    if (!value) {
      return value
    }

    return new Timeline(value.rows ? value.rows.map(TimelineRow.fromObject) : [])
  }

  createEmptyRow (): TimelineRow {
    return TimelineRow.empty()
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  getMaxNumberOfRows (): number {
    return MAX_ROW_COUNT
  }
}
