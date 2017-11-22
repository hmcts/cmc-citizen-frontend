import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'

@ValidatorConstraint()
export class AtLeastOneFieldIsPopulatedConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }

    if (!(value instanceof NumberOfChildren)) {
      return false
    }

    return !!(value.under11 || value.between11and15 || value.between16and19)
  }
}

/**
 * Validates if one of the fields in `NumberOfChildren` is populated. It doesn't matter which one as long as one
 * as long as at least one of them has any value.
 *
 * The value can be even invalid - it will be caught by other validators.
 */
export function AtLeastOneFieldIsPopulated (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneFieldIsPopulatedConstraint
    })
  }
}
