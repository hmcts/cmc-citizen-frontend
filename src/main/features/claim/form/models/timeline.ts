import { MultiRowForm } from 'forms/models/multiRowForm'
import { TimelineRow } from 'claim/form/models/timelineRow'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 4

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW: string = 'Enter at least one row'
}

export class Timeline extends MultiRowForm<TimelineRow> {

  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: TimelineRow[]

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
