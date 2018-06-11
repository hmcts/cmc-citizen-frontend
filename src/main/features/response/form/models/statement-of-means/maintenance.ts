import { IsDefined, IsInt, IsPositive, ValidateIf } from 'class-validator'

import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class Maintenance {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared: boolean

  @ValidateIf(o => o.declared === true)
  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @IsPositive({ message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  value: number

  constructor (declared?: boolean, value?: number) {
    this.declared = declared
    this.value = value
  }

  static fromObject (value?: any): Maintenance {
    if (!value) {
      return value
    }

    const declared: boolean = value.declared !== undefined ? toBoolean(value.declared) : undefined

    return new Maintenance(
      declared,
      declared ? toNumberOrUndefined(value.value) : undefined
    )
  }

  deserialize (input?: any): Maintenance {
    if (input) {
      this.declared = input.declared
      if (this.declared) {
        this.value = input.value
      }
    }
    return this
  }
}
