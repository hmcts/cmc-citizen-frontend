import { ValidateNested } from 'class-validator'

import { Serializable } from 'models/serializable'
import { TimelineRow } from 'response/form/models/timelineRow'

export const INIT_ROW_COUNT: number = 4

export class TimelineBreakdown implements Serializable<TimelineBreakdown> {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  rows: TimelineRow[]

  constructor (rows: TimelineRow[] = TimelineBreakdown.initialRows()) {
    this.rows = rows
  }

  static initialRows (): TimelineRow[] {
    let rows: TimelineRow[] = []

    for (let i = 0; i < INIT_ROW_COUNT; i++) {
      rows.push(TimelineRow.empty())
    }

    return rows
  }

  static fromObject (value?: any): TimelineBreakdown {
    if (!value) {
      return value
    }

    return new TimelineBreakdown(value.rows ? value.rows.map(TimelineRow.fromObject) : [])
  }

  deserialize (input?: any): TimelineBreakdown {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    this.rows.push(TimelineRow.empty())
  }

  private deserializeRows (rows: any): TimelineRow[] {
    if (!rows) {
      return TimelineBreakdown.initialRows()
    }

    let timelineRows: TimelineRow[] = []

    for (let row in rows) {
      timelineRows.push(new TimelineRow().deserialize(rows[row]))
    }

    for (let i = 0; i < INIT_ROW_COUNT - rows.length; i++) {
      timelineRows.push(TimelineRow.empty())
    }

    return timelineRows
  }

}
