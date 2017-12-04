import { IsDefined, IsInt, Min } from 'class-validator'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class UnemploymentDetails {

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  years: number

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
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
