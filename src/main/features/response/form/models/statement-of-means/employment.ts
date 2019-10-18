import { IsDefined, ValidateIf } from '@hmcts/class-validator'

import * as toBoolean from 'to-boolean'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly SELECT_AT_LEAST_ONE_OPTION: string = 'You must select at least one option'
}

export class Employment {
  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared: boolean

  @ValidateIf(o => o.declared === true && !o.selfEmployed && !o.employed)
  @IsBooleanTrue({ message: ValidationErrors.SELECT_AT_LEAST_ONE_OPTION })
  employed: boolean

  selfEmployed: boolean

  constructor (declared?: boolean, employed?: boolean, selfEmployed?: boolean) {
    this.declared = declared
    if (this.declared) {
      this.employed = employed
      this.selfEmployed = selfEmployed
    }
  }

  static fromObject (value?: any): Employment {
    if (!value) {
      return value
    }

    const declared: boolean = value.declared !== undefined ? toBoolean(value.declared) : undefined

    return new Employment(
      declared,
      declared ? value.employed !== undefined ? toBoolean(value.employed) : undefined : undefined,
      declared ? value.selfEmployed !== undefined ? toBoolean(value.selfEmployed) : undefined : undefined
    )
  }

  deserialize (input?: any): Employment {
    if (input) {
      this.declared = input.declared
      if (this.declared) {
        this.employed = input.employed
        this.selfEmployed = input.selfEmployed
      }
    }
    return this
  }
}
