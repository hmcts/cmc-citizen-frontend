import { IsDefined, IsIn, ValidateIf } from '@hmcts/class-validator'

import { MaxLength } from '@hmcts/cmc-validators'

import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { EvidenceType } from 'forms/models/evidenceType'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose type of evidence'
}

export class EvidenceRow extends MultiRowFormItem {

  @ValidateIf(o => o.type !== undefined)
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(EvidenceType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: EvidenceType

  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  description?: string

  constructor (type?: EvidenceType, description?: string) {
    super()
    this.type = type
    this.description = description
  }

  static empty (): EvidenceRow {
    return new EvidenceRow(undefined, undefined)
  }

  static fromObject (value?: any): EvidenceRow {
    if (!value) {
      return value
    }

    const type: EvidenceType = EvidenceType.valueOf(value.type)
    const description: string = value.description || undefined

    return new EvidenceRow(type, description)
  }

  deserialize (input?: any): EvidenceRow {
    if (input && input.type) {
      this.type = EvidenceType.valueOf(input.type.value)
      this.description = input.description
    }

    return this
  }
}
