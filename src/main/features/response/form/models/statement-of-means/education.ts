import { IsDefined, IsInt, Min } from 'class-validator'

import { Serializable } from 'models/serializable'
import { NumericUtils } from 'common/utils/numericUtils'

export class ValidationErrors {
  static readonly INVALID_NUMBER: string = 'Enter a valid number'
}

export class Education implements Serializable<Education> {

  @IsDefined({ message: ValidationErrors.INVALID_NUMBER })
  @IsInt({ message: ValidationErrors.INVALID_NUMBER })
  @Min(0, { message: ValidationErrors.INVALID_NUMBER })
  value: number

  constructor (value?: number) {
    this.value = value
  }

  static fromObject (value?: any): Education {
    if (!value) {
      return value
    }

    return new Education(NumericUtils.toNumberOrUndefined(value.value))
  }

  deserialize (input?: any): Education {
    if (input) {
      this.value = input.value
    }
    return this
  }
}
