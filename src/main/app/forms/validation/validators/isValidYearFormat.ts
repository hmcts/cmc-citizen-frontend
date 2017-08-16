import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

import { LocalDate } from 'forms/models/localDate'

@ValidatorConstraint()
export class IsValidYearFormatConstraint implements ValidatorConstraintInterface {

  validate (value: any | LocalDate, args?: ValidationArguments): boolean {
    const [digits] = args.constraints

    if (!digits || digits <= 0) {
      throw new Error('Allowed digits in year have to be specified and positive value')
    }

    if (value == null) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    return new Number(value.year).toString().length === digits
  }

}

/**
 * Verify is a valid year format in local date.
 */
export function isValidYearFormat (digits: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [digits],
      validator: IsValidYearFormatConstraint
    })
  }
}
