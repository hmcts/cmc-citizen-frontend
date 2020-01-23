import { IsInt, Min, ValidateIf } from '@hmcts/class-validator'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class NumberOfChildren {

  @ValidateIf(o => o.under11 !== undefined)
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  under11: number

  @ValidateIf(o => o.between11and15 !== undefined)
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  between11and15: number

  @ValidateIf(o => o.between16and19 !== undefined)
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  between16and19: number

  constructor (under11?: number, between11and15?: number, between16and19?: number) {
    this.under11 = under11
    this.between11and15 = between11and15
    this.between16and19 = between16and19
  }

  static fromObject (value?: any): NumberOfChildren {
    if (!value) {
      return value
    }

    return new NumberOfChildren(
      toNumberOrUndefined(value.under11),
      toNumberOrUndefined(value.between11and15),
      toNumberOrUndefined(value.between16and19)
    )
  }

  deserialize (input?: any): NumberOfChildren {
    if (input) {
      this.under11 = input.under11
      this.between11and15 = input.between11and15
      this.between16and19 = input.between16and19
    }
    return this
  }
}
