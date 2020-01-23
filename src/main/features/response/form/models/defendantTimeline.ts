import { TimelineRow } from 'forms/models/timelineRow'
import { Timeline } from 'forms/models/timeline'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { MaxLength, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class DefendantTimeline extends Timeline {

  @ValidateIf(o => o.comment !== undefined)
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  comment?: string

  constructor (rows?: TimelineRow[], comment?: string) {
    super(rows)
    this.comment = comment || undefined
  }

  static fromObject (value?: any): DefendantTimeline {
    if (!value) {
      return value
    }

    return new DefendantTimeline(value.rows ? value.rows.map(TimelineRow.fromObject) : [], value.comment)
  }

  deserialize (input?: any): DefendantTimeline {
    if (!input) {
      return new DefendantTimeline()
    }

    this.rows = this.deserializeRows(input.rows)
    this.comment = input.comment || undefined

    return this
  }
}
