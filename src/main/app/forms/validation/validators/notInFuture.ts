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
export class DateNotInFutureConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const date = value.toMoment()
    const now = MomentFactory.currentDate()

    return !date.isAfter(now)
  }
}

export function IsNotInFuture (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DateNotInFutureConstraint
    })
  }
}
