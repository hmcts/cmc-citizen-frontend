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
export class MinimumAgeValidatorConstraint implements ValidatorConstraintInterface {

  validate (value: any | LocalDate, args?: ValidationArguments): boolean {
    const [minYears] = args.constraints

    if (!minYears || minYears <= 0) {
      throw new Error('Min Years in the past has to be specified and positive value')
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

    return years >= minYears
  }

}

/**
 * Verify is a within age limit.
 */
export function MinimumAgeValidator (minYears: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minYears],
      validator: MinimumAgeValidatorConstraint
    })
  }
}
