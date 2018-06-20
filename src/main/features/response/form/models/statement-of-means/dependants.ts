import { IsDefined, ValidateIf, ValidateNested } from 'class-validator'

import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { AtLeastOneFieldIsPopulated } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE: string = 'Enter a number for at least one field'
}

export class Dependants {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasAnyChildren: boolean

  @ValidateIf(o => o.hasAnyChildren === true)
  @ValidateNested()
  @AtLeastOneFieldIsPopulated({ message: ValidationErrors.ENTER_AT_LEAST_ONE })
  numberOfChildren: NumberOfChildren

  constructor (hasAnyChildren?: boolean, numberOfChildren?: NumberOfChildren) {
    this.hasAnyChildren = hasAnyChildren
    this.numberOfChildren = numberOfChildren
  }

  static fromObject (value?: any): Dependants {
    if (!value) {
      return value
    }

    const hasAnyChildren: boolean = value.hasAnyChildren !== undefined ? toBoolean(value.hasAnyChildren) : undefined

    return new Dependants(
      hasAnyChildren,
      hasAnyChildren ? NumberOfChildren.fromObject(value.numberOfChildren) : undefined
    )
  }

  deserialize (input?: any): Dependants {
    if (input) {
      this.hasAnyChildren = input.hasAnyChildren
      if (this.hasAnyChildren) {
        this.numberOfChildren = new NumberOfChildren().deserialize(input.numberOfChildren)
      }
    }
    return this
  }
}
