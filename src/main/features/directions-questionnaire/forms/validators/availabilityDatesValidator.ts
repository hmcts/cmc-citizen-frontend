import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'
import { IsValidLocalDateConstraint } from '@hmcts/cmc-validators'
import { LocalDate } from 'forms/models/localDate'
import { Availability, ValidationErrors } from 'directions-questionnaire/forms/models/availability'

@ValidatorConstraint()
export class AvailabilityDatesConstraint implements ValidatorConstraintInterface {
  private isValidLocalDate: IsValidLocalDateConstraint = new IsValidLocalDateConstraint()

  validate (value: any | LocalDate[], args?: ValidationArguments): boolean {
    if (args && args.object && args.object instanceof Availability) {
      const availability: Availability = args.object
      if (availability.hasUnavailableDates) {
        if (!availability.unavailableDates || availability.unavailableDates.length === 0) {
          return false
        }
        if (availability.unavailableDates.some(date => !this.isValidLocalDate.validate(date, null))) {
          return false
        }
      } else if (availability.unavailableDates && availability.unavailableDates.length > 0) {
        return false
      }
    }

    return true
  }

  defaultMessage (args?: ValidationArguments): string {
    const availability: Availability = args.object as Availability
    if (availability.hasUnavailableDates) {
      if (!availability.unavailableDates || availability.unavailableDates.length === 0) {
        return ValidationErrors.AT_LEAST_ONE_DATE
      }
      if (availability.unavailableDates.some(date => !this.isValidLocalDate.validate(date, null))) {
        return ValidationErrors.DATE_NOT_VALID
      }
    } else if (availability.unavailableDates && availability.unavailableDates.length > 0) {
      return ValidationErrors.CLEAR_ALL_DATES
    }
  }
}

export function IsValidAvailabilityDates (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AvailabilityDatesConstraint
    })
  }
}
