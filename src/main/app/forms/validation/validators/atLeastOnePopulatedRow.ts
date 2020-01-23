import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'

import { MultiRowForm } from 'forms/models/multiRowForm'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'

@ValidatorConstraint()
export class AtLeastOnePopulatedRowConstraint implements ValidatorConstraintInterface {

  validate (value: any | MultiRowForm<MultiRowFormItem>, args?: ValidationArguments): boolean {
    if (value === undefined) {
      return true
    }

    if (!(value instanceof Array)) {
      return false
    }

    return value.filter(item => !item.isEmpty()).length >= 1
  }
}

/**
 * Verify there is at least one populated row in multi-row form.
 */
export function AtLeastOnePopulatedRow (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOnePopulatedRowConstraint
    })
  }
}
