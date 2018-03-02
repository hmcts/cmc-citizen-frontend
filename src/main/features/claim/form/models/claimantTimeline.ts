import { MultiRowForm } from 'forms/models/multiRowForm'
import { TimelineRow } from '../../../../app/forms/models/timelineRow'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'

export const MAX_NUMBER_OF_ROWS: number = 10
export const MIN_NUMBER_OF_ROWS: number = 1
export const INIT_ROW_COUNT: number = 4

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW: string = 'Enter at least one row'
}

export class ClaimantTimeline extends MultiRowForm<TimelineRow> {

  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: TimelineRow[]

  static fromObject (value?: any): ClaimantTimeline {
    if (!value) {
      return value
    }

    return new ClaimantTimeline(value.rows ? value.rows.map(TimelineRow.fromObject) : [])
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

  isCompleted (): boolean {
    return this.getPopulatedRowsOnly().length >= MIN_NUMBER_OF_ROWS
  }
}
