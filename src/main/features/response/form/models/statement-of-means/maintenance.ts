import { IsDefined, IsInt, IsPositive, ValidateIf } from 'class-validator'

import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class Maintenance {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  option: boolean

  @ValidateIf(o => o.option === true)
  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @IsPositive({ message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  value: number

  constructor (option?: boolean, value?: number) {
    this.option = option
    this.value = value
  }

  static fromObject (value?: any): Maintenance {
    if (!value) {
      return value
    }

    const option: boolean = value.option !== undefined ? toBoolean(value.option) : undefined

    return new Maintenance(
      option,
      option ? toNumberOrUndefined(value.value) : undefined
    )
  }

  deserialize (input?: any): Maintenance {
    if (input) {
      this.option = input.option
      if (this.option) {
        this.value = input.value
      }
    }
    return this
  }
}
