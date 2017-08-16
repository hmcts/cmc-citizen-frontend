import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

import * as validator from 'validator'

@ValidatorConstraint()
export class FractionsConstraint implements ValidatorConstraintInterface {

  validate (value: any, args?: ValidationArguments): boolean {
    const [min, max] = args.constraints
    if (min == null || min < 0) {
      throw new Error('Minimum allowed decimal places has to be specified and positive value')
    }

    if (max == null || max < 0) {
      throw new Error('Maximum allowed decimal places has to be specified and positive value')
    }

    if (value == null) {
      return true
    }
    const regex = '^\\d+\\.*\\d{' + min + ',' + max + '}\$'
    return validator.matches(value.toString(), new RegExp(regex))
  }
}

/**
 * Verify a valid value with minimum and maxumim digits allowed after decimal point.
 */
export function Fractions (min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: FractionsConstraint
    })
  }
}
