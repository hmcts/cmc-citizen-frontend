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
export class DateInFutureConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value == null) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const date = value.toMoment()
    const now = MomentFactory.currentDate()

    return date.isAfter(now)
  }
}

export function IsInFuture (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DateInFutureConstraint
    })
  }
}
