import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { MaxLength, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { Evidence } from 'forms/models/evidence'
import { EvidenceRow } from 'forms/models/evidenceRow'

export class DefendantEvidence extends Evidence {

  @ValidateIf(o => o.comment !== undefined)
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  comment?: string

  constructor (rows?: EvidenceRow[], comment?: string) {
    super(rows)
    this.comment = comment || undefined
  }

  static fromObject (value?: any): DefendantEvidence {
    if (!value) {
      return value
    }

    return new DefendantEvidence(value.rows ? value.rows.map(EvidenceRow.fromObject) : [], value.comment)
  }

  deserialize (input?: any): DefendantEvidence {
    if (!input) {
      return new DefendantEvidence()
    }

    this.rows = this.deserializeRows(input.rows)
    this.comment = input.comment || undefined

    return this
  }
}
