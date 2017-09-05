import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

import { MomentFactory } from 'common/momentFactory'
import { LocalDate } from 'forms/models/localDate'

@ValidatorConstraint()
export class DateTodayOrInFutureConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value == null) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const date = value.toMoment()
    const now = MomentFactory.currentDate()
    if (date.isAfter(now) || date.isSame(now)) {
      return true
    }
  }
}

export function IsTodayOrInFuture (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DateTodayOrInFutureConstraint
    })
  }
}
