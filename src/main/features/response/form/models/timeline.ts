import { ValidateNested } from 'class-validator'

import { TimelineRow } from 'response/form/models/timelineRow'

export const INIT_ROW_COUNT: number = 4
export const MAX_NUMBER_OF_EVENTS: number = 20

export class Timeline {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  rows: TimelineRow[]

  constructor (rows: TimelineRow[] = Timeline.initialRows()) {
    this.rows = rows
  }

  static fromObject (value?: any): Timeline {
    if (!value) {
      return value
    }

    return new Timeline(value.rows ? value.rows.map(TimelineRow.fromObject) : [])
  }

  private static initialRows (rows: number = INIT_ROW_COUNT): TimelineRow[] {
    return new Array(rows).fill(TimelineRow.empty())
  }

  deserialize (input?: any): Timeline {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    if (this.canAddMoreRows()) {
      this.rows.push(TimelineRow.empty())
    }
  }

  removeExcessRows () {
    this.rows = this.rows.filter(item => !!item.date && !!item.description)

    if (this.rows.length === 0) {
      this.appendRow()
    }
  }

  canAddMoreRows () {
    return this.rows.length < MAX_NUMBER_OF_EVENTS
  }

  private deserializeRows (rows: any): TimelineRow[] {
    if (!rows) {
      return Timeline.initialRows()
    }

    let timelineRows: TimelineRow[] = rows.map(row => new TimelineRow().deserialize(row))

    if (rows.length < INIT_ROW_COUNT) {
      timelineRows = timelineRows.concat(Timeline.initialRows(INIT_ROW_COUNT - rows.length))
    }

    return timelineRows
  }

}
