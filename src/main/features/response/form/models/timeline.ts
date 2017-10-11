import { ValidateNested } from 'class-validator'

import { Serializable } from 'models/serializable'
import { TimelineRow } from 'response/form/models/timelineRow'

export const INIT_ROW_COUNT: number = 4

export class Timeline implements Serializable<Timeline> {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  rows: TimelineRow[]

  constructor (rows: TimelineRow[] = Timeline.initialRows()) {
    this.rows = rows
  }

  static initialRows (): TimelineRow[] {
    return new Array(INIT_ROW_COUNT).fill(TimelineRow.empty())
  }

  static fromObject (value?: any): Timeline {
    if (!value) {
      return value
    }

    return new Timeline(value.rows ? value.rows.map(TimelineRow.fromObject) : [])
  }

  deserialize (input?: any): Timeline {
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
      return Timeline.initialRows()
    }

    let timelineRows: TimelineRow[] = rows.map(row => new TimelineRow().deserialize(row))

    for (let i = 0; i < INIT_ROW_COUNT - rows.length; i++) {
      timelineRows.push(TimelineRow.empty())
    }

    return timelineRows
  }

}
