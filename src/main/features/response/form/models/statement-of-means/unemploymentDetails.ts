import { IsDefined, IsInt, Max, Min } from '@hmcts/class-validator'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly TOO_MANY: string = 'Enter a number between 0 and $constraint1'
}

export class ValidationConstraints {
  static readonly MAX_NUMBER_OF_MONTHS: number = 11
  static readonly MAX_NUMBER_OF_YEARS: number = 80
}

export class UnemploymentDetails {

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  @Max(ValidationConstraints.MAX_NUMBER_OF_YEARS, { message: ValidationErrors.TOO_MANY })
  years: number

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  @Max(ValidationConstraints.MAX_NUMBER_OF_MONTHS, { message: ValidationErrors.TOO_MANY })
  months: number

  constructor (years?: number, months?: number) {
    this.years = years
    this.months = months
  }

  static fromObject (value?: any): UnemploymentDetails {
    if (!value) {
      return value
    }

    return new UnemploymentDetails(
      toNumberOrUndefined(value.years),
      toNumberOrUndefined(value.months)
    )
  }

  deserialize (input?: any): UnemploymentDetails {
    if (input) {
      this.months = input.months
      this.years = input.years
    }
    return this
  }
}
