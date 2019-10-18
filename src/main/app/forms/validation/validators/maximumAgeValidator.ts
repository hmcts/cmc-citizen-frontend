import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'
import { MomentFactory } from 'shared/momentFactory'

import { LocalDate } from 'forms/models/localDate'

@ValidatorConstraint()
export class MaximumAgeValidatorConstraint implements ValidatorConstraintInterface {

  validate (value: any | LocalDate, args?: ValidationArguments): boolean {
    const [maxYears] = args.constraints

    if (!maxYears || maxYears <= 0) {
      throw new Error('Max Years in the past has to be specified and positive value')
    }

    if (value === undefined) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const today = MomentFactory.currentDate()
    const date = value.toMoment()
    const years = today.diff(date, 'years')

    return years <= maxYears
  }

}

/**
 * Verify is a within age limit.
 */
export function MaximumAgeValidator (maxYears: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxYears],
      validator: MaximumAgeValidatorConstraint
    })
  }
}
