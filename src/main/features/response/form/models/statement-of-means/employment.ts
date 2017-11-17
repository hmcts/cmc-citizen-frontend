import { IsDefined, ValidateIf } from 'class-validator'

import { Serializable } from 'models/serializable'
import * as toBoolean from 'to-boolean'
import { IsBooleanTrue } from 'forms/validation/validators/isBooleanTrue'

export class ValidationErrors {
  static readonly IS_CURRENTLY_EMPLOYED_NOT_SELECTED: string = 'Select an option'
  static readonly SELECT_AT_LEAST_ONE_OPTION: string = 'You must check at least one option'
}

export class Employment implements Serializable<Employment> {
  @IsDefined({ message: ValidationErrors.IS_CURRENTLY_EMPLOYED_NOT_SELECTED })
  isCurrentlyEmployed: boolean

  @ValidateIf(o => o.isCurrentlyEmployed === true && !o.selfEmployed && !o.employed)
  @IsBooleanTrue({ message: ValidationErrors.SELECT_AT_LEAST_ONE_OPTION })
  employed: boolean

  selfEmployed: boolean

  constructor (isCurrentlyEmployed?: boolean, employed?: boolean, selfEmployed?: boolean) {
    this.isCurrentlyEmployed = isCurrentlyEmployed
    this.employed = employed
    this.selfEmployed = selfEmployed
  }

  static fromObject (value?: any): Employment {
    if (!value) {
      return value
    }

    const employment = new Employment(
      value.isCurrentlyEmployed !== undefined ? toBoolean(value.isCurrentlyEmployed) === true : undefined,
      value.employed !== undefined ? toBoolean(value.employed) === true : undefined,
      value.selfEmployed !== undefined ? toBoolean(value.selfEmployed) === true : undefined
    )

    if (!employment.isCurrentlyEmployed) {
      employment.employed = employment.selfEmployed = undefined
    }

    return employment
  }

  deserialize (input?: any): Employment {
    if (input) {
      this.isCurrentlyEmployed = input.isCurrentlyEmployed
      if (this.isCurrentlyEmployed) {
        this.employed = input.employed
        this.selfEmployed = input.selfEmployed
      }
    }
    return this
  }
}
