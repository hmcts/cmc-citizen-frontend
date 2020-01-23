import { IsDefined, ValidateIf, ValidateNested } from '@hmcts/class-validator'

import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { AtLeastOneFieldIsPopulated } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE: string = 'Enter a number for at least one field'
}

export class Dependants {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared: boolean

  @ValidateIf(o => o.declared === true)
  @ValidateNested()
  @AtLeastOneFieldIsPopulated({ message: ValidationErrors.ENTER_AT_LEAST_ONE })
  numberOfChildren: NumberOfChildren

  constructor (declared?: boolean, numberOfChildren?: NumberOfChildren) {
    this.declared = declared
    this.numberOfChildren = numberOfChildren
  }

  static fromObject (value?: any): Dependants {
    if (!value) {
      return value
    }

    const declared: boolean = value.declared !== undefined ? toBoolean(value.declared) : undefined

    return new Dependants(
      declared,
      declared ? NumberOfChildren.fromObject(value.numberOfChildren) : undefined
    )
  }

  deserialize (input?: any): Dependants {
    if (input) {
      this.declared = input.declared
      if (this.declared) {
        this.numberOfChildren = new NumberOfChildren().deserialize(input.numberOfChildren)
      }
    }
    return this
  }
}
