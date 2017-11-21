import { IsDefined, IsInt, Min } from 'class-validator'

import { Serializable } from 'models/serializable'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationErrors } from 'forms/validation/validationErrors'

export class Education implements Serializable<Education> {

  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @IsInt({ message: ValidationErrors.NUMBER_REQUIRED })
  @Min(0, { message: ValidationErrors.NUMBER_REQUIRED })
  value: number

  constructor (value?: number) {
    this.value = value
  }

  static fromObject (value?: any): Education {
    if (!value) {
      return value
    }

    return new Education(toNumberOrUndefined(value.value))
  }

  deserialize (input?: any): Education {
    if (input) {
      this.value = input.value
    }
    return this
  }
}
