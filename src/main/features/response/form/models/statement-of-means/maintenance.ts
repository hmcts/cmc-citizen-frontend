import { IsDefined, IsInt, IsPositive, ValidateIf } from 'class-validator'

import { Serializable } from 'models/serializable'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class Maintenance implements Serializable<Maintenance> {

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

    const maintenance = new Maintenance(
      value.option !== undefined ? toBoolean(value.option) === true : undefined,
      toNumberOrUndefined(value.value)
    )

    if (!maintenance.option) {
      maintenance.value = undefined
    }

    return maintenance
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
