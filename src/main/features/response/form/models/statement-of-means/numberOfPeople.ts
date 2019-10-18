import { IsDefined, IsInt, Min } from '@hmcts/class-validator'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MaxLength, IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly NUMBER_OF_PEOPLE_REQUIRED: string = 'Enter a number of people you support'
  static readonly DETAILS_REQUIRED: string = 'Enter details'
}

export class NumberOfPeople {

  @IsDefined({ message: ValidationErrors.NUMBER_OF_PEOPLE_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  value: number

  @IsDefined({ message: ValidationErrors.DETAILS_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DETAILS_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  details: string

  constructor (value?: number, details?: string) {
    this.value = value
    this.details = details
  }

  static fromObject (value?: any): NumberOfPeople {
    if (!value) {
      return value
    }

    return new NumberOfPeople(
      toNumberOrUndefined(value.value),
      value.details || undefined
    )
  }

  deserialize (input?: any): NumberOfPeople {
    if (input) {
      this.value = input.value
      this.details = input.details
    }
    return this
  }
}
