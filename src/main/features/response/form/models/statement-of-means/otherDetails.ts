import { IsDefined } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { MaxLength, IsNotBlank } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly DETAILS_REQUIRED: string = 'Enter details'
}

export class OtherDetails {

  @IsDefined({ message: ValidationErrors.DETAILS_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DETAILS_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  details: string

  constructor (details?: string) {
    this.details = details
  }

  static fromObject (value?: any): OtherDetails {
    if (!value) {
      return value
    }

    return new OtherDetails(value.details || undefined)
  }

  deserialize (input?: any): OtherDetails {
    if (input) {
      this.details = input.details
    }
    return this
  }
}
