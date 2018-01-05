import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

import { LocalDate } from 'forms/models/localDate'

const numberOfDigitsInAYear: number = 4

@ValidatorConstraint()
export class IsValidYearFormatConstraint implements ValidatorConstraintInterface {

  validate (value: any | LocalDate, args?: ValidationArguments): boolean {
    if (value === undefined) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    return Number(value.year).toString().length === numberOfDigitsInAYear
  }

}

/**
 * Verify is a valid year format in local date.
 */
export function IsValidYearFormat (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidYearFormatConstraint
    })
  }
}
