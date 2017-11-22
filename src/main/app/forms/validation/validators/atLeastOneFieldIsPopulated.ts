import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class AtLeastOneFieldIsPopulatedConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }

    return Object.keys(value).some(key => !!value[key])
  }
}

/**
 * Validates if one of the fields in object is populated. It doesn't matter which one as long as one
 * as long as at least one of them has any value. It doesn't matter what is the value as long as it's no falsy.
 */
export function AtLeastOneFieldIsPopulated (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneFieldIsPopulatedConstraint
    })
  }
}
