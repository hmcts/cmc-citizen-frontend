import { IsDefined, ValidateIf, ValidateNested } from 'class-validator'

import { Serializable } from 'models/serializable'
import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { AtLeastOneFieldIsPopulated } from 'forms/validation/validators/atLeastOneFieldIsPopulated'

export class ValidationErrors {
  static readonly ENTER_AT_LEAST_ONE: string = 'Enter a number for at least one field'
}

export class Dependants implements Serializable<Dependants> {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasAnyChildren: boolean

  @ValidateIf(o => o.hasAnyChildren === true)
  @ValidateNested({ each: true })
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

    const dependants = new Dependants(
      value.hasAnyChildren !== undefined ? toBoolean(value.hasAnyChildren) === true : undefined,
      NumberOfChildren.fromObject(value.numberOfChildren)
    )

    if (!dependants.hasAnyChildren) {
      dependants.numberOfChildren = undefined
    }

    return dependants
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
