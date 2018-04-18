import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

import * as validator from 'validator'

@ValidatorConstraint()
export class IsValidPostcodeConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments): boolean {
    if (value === undefined || value === null) {
      return true
    }
    const UK_POSTCODE_REGEX = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/
    const normalised = value.toString().replace(/\s/g,'')
    return validator.matches(normalised, new RegExp(UK_POSTCODE_REGEX))
  }

  defaultMessage (args: ValidationArguments) {
    return 'Enter a valid postcode'
  }
}

/**
 * Verify a valid UK postcode format.
 *
 */
export function IsValidPostcode (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPostcodeConstraint
    })
  }
}
