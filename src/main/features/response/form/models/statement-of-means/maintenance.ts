import { IsDefined, IsInt, Min, ValidateIf } from 'class-validator'

import { Serializable } from 'models/serializable'
import { NumericUtils } from 'common/utils/numericUtils'
import * as toBoolean from 'to-boolean'

export class ValidationErrors {
  static readonly OPTION_NOT_SELECTED: string = 'Select an option'
  static readonly INVALID_NUMBER: string = 'Enter a valid number'
}

export class Maintenance implements Serializable<Maintenance> {

  @IsDefined({ message: ValidationErrors.OPTION_NOT_SELECTED })
  option: boolean

  @ValidateIf(o => o.option === true)
  @IsDefined({ message: ValidationErrors.INVALID_NUMBER })
  @IsInt({ message: ValidationErrors.INVALID_NUMBER })
  @Min(1, { message: ValidationErrors.INVALID_NUMBER })
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
      NumericUtils.toNumberOrUndefined(value.value)
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
