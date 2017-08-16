import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

import * as validator from 'validator'

@ValidatorConstraint()
export class IsEmailConstraint implements ValidatorConstraintInterface {

  validate (value: any, args?: ValidationArguments): boolean {
    return typeof value === 'string' && (value.length === 0 || validator.isEmail(value))
  }

}

/**
 * Verify a valid email address.
 *
 * Validator validates only non empty string values, everything else is considered valid.
 */
export function IsEmail (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailConstraint
    })
  }
}
