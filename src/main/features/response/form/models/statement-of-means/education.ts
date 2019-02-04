import { IsDefined, IsInt, Min } from '@hmcts/class-validator'

import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { IsLessThanOrEqualTo } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly INVALID_NUMBER_OF_CHILDREN: string = 'Number can’t be higher than on previous page'
}

export class Education {

  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: GlobalValidationErrors.INTEGER_REQUIRED })
  @IsLessThanOrEqualTo('maxValue', { message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
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
