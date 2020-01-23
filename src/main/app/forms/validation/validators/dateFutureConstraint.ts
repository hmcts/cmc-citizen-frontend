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
export class DateFutureConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const [distanceInDays] = args.constraints

    const date = value.toMoment()
    const pointInTime = MomentFactory.currentDate().add(distanceInDays, 'day')
    return date.isAfter(pointInTime)
  }
}

export function IsFutureDate (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [0],
      validator: DateFutureConstraint
    })
  }
}

export function IsFutureDateByNumberOfDays (distanceInDays: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [distanceInDays],
      validator: DateFutureConstraint
    })
  }
}
