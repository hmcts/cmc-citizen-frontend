import { IsDefined, IsInt, Min, ValidateIf } from 'class-validator'

import { Serializable } from 'models/serializable'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE: string = 'Enter a number for at least one field'
}

export class Dependants implements Serializable<Dependants> {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasAnyChildren: boolean

  @ValidateIf(o => o.hasAnyChildren === true && !o.under11 && !o.between11and15 && !o.between16and19)
  @IsInt({ message: ValidationErrors.ENTER_AT_LEAST_ONE })
  crossFieldError: number

  @ValidateIf(o => o.hasAnyChildren === true && o.under11 !== undefined)
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  under11: number

  @ValidateIf(o => o.hasAnyChildren === true && o.between11and15 !== undefined)
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  between11and15: number

  @ValidateIf(o => o.hasAnyChildren === true && o.between16and19 !== undefined)
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  between16and19: number

  constructor (hasAnyChildren?: boolean, under11?: number, between11and15?: number, between16and19?: number) {
    this.hasAnyChildren = hasAnyChildren
    this.under11 = under11
    this.between11and15 = between11and15
    this.between16and19 = between16and19
  }

  static fromObject (value?: any): Dependants {
    if (!value) {
      return value
    }

    const dependants = new Dependants(
      value.hasAnyChildren !== undefined ? toBoolean(value.hasAnyChildren) === true : undefined,
      toNumberOrUndefined(value.under11),
      toNumberOrUndefined(value.between11and15),
      toNumberOrUndefined(value.between16and19)
    )

    if (!dependants.hasAnyChildren) {
      dependants.under11 = dependants.between11and15 = dependants.between16and19 = undefined
    }

    return dependants
  }

  deserialize (input?: any): Dependants {
    if (input) {
      this.hasAnyChildren = input.hasAnyChildren
      if (this.hasAnyChildren) {
        this.under11 = input.under11
        this.between11and15 = input.between11and15
        this.between16and19 = input.between16and19
      }
    }
    return this
  }
}
