import { TimelineRow } from 'forms/models/timelineRow'
import { Timeline } from 'forms/models/timeline'
import { AtLeastOnePopulatedRow } from 'forms/validation/validators/atLeastOnePopulatedRow'

export const MIN_NUMBER_OF_ROWS: number = 1

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE_ROW: string = 'Enter at least one row'
}

export class ClaimantTimeline extends Timeline {

  @AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
  rows: TimelineRow[]

  static fromObject (value?: any): ClaimantTimeline {
    if (!value) {
      return value
    }

    return new ClaimantTimeline(value.rows ? value.rows.map(TimelineRow.fromObject) : [])
  }

  isCompleted (): boolean {
    return this.getPopulatedRowsOnly().length >= MIN_NUMBER_OF_ROWS
  }
}
