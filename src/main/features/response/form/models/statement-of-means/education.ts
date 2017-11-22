import { IsDefined, IsInt, Min } from 'class-validator'

import { Serializable } from 'models/serializable'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { IsLessThanOrEqualTo } from 'forms/validation/validators/isLessThanOrEqualTo'

export class ValidationErrors {
  static readonly INVALID_NUMBER_OF_CHILDREN: string =
    'You can’t have more children aged 16-19 than you gave on previous page'
}

export class Education implements Serializable<Education> {

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsLessThanOrEqualTo('maxValue', { message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  @Min(0, { message: GlobalValidationErrors.NUMBER_REQUIRED })
  value: number

  maxValue: number

  constructor (value?: number, maxValue?: number) {
    this.value = value
    this.maxValue = maxValue
  }

  static fromObject (value?: any): Education {
    if (!value) {
      return value
    }

    return new Education(toNumberOrUndefined(value.value), toNumberOrUndefined(value.maxValue))
  }

  deserialize (input?: any): Education {
    if (input) {
      this.value = input.value
      this.maxValue = input.maxValue
    }
    return this
  }
}
