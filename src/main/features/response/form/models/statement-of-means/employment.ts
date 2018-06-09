import { IsDefined, ValidateIf } from 'class-validator'

import * as toBoolean from 'to-boolean'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly SELECT_AT_LEAST_ONE_OPTION: string = 'You must select at least one option'
}

export class Employment {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  currentlyEmployed: boolean

  @ValidateIf(o => o.currentlyEmployed === true && !o.selfEmployed && !o.employed)
  @IsBooleanTrue({ message: ValidationErrors.SELECT_AT_LEAST_ONE_OPTION })
  employed: boolean

  selfEmployed: boolean

  constructor (currentlyEmployed?: boolean, employed?: boolean, selfEmployed?: boolean) {
    this.currentlyEmployed = currentlyEmployed
    if (this.currentlyEmployed) {
      this.employed = employed
      this.selfEmployed = selfEmployed
    }
  }

  static fromObject (value?: any): Employment {
    if (!value) {
      return value
    }

    const currentlyEmployed: boolean = value.currentlyEmployed !== undefined ? toBoolean(value.currentlyEmployed) : undefined

    return new Employment(
      currentlyEmployed,
      currentlyEmployed ? value.employed !== undefined ? toBoolean(value.employed) : undefined : undefined,
      currentlyEmployed ? value.selfEmployed !== undefined ? toBoolean(value.selfEmployed) : undefined : undefined
    )
  }

  deserialize (input?: any): Employment {
    if (input) {
      this.currentlyEmployed = input.currentlyEmployed
      if (this.currentlyEmployed) {
        this.employed = input.employed
        this.selfEmployed = input.selfEmployed
      }
    }
    return this
  }
}
