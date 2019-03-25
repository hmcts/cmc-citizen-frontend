import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'

import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'
import { isArray } from 'util'

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

@ValidatorConstraint()
export class DatesFutureConstraint implements ValidatorConstraintInterface {
  private validator: DateFutureConstraint = new DateFutureConstraint()

  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }

    if (!isArray(value)) {
      return false
    }

    const values: any[] = value as any[]
    return values.reduce((current, date) => current && this.validator.validate(date, args), true)
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

export function AreFutureDates (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DatesFutureConstraint
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
