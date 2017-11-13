import { IsDefined, IsIn, ValidateIf } from 'class-validator'

import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { EvidenceType } from 'response/form/models/evidenceType'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose type of evidence'
  static readonly DESCRIPTION_TOO_LONG: string = 'You’ve entered too many characters'
}

export class EvidenceRow {

  @ValidateIf(o => o.type !== undefined)
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(EvidenceType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: EvidenceType

  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.DESCRIPTION_TOO_LONG })
  description?: string

  constructor (type?: EvidenceType, description?: string) {
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
