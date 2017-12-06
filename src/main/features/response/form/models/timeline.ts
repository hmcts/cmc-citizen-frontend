import { MultiRowForm } from 'forms/models/multiRowForm'
import { TimelineRow } from 'response/form/models/timelineRow'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 2

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
    return MAX_NUMBER_OF_ROWS
  }
}
