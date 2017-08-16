import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class IsNotBlankConstraint implements ValidatorConstraintInterface {

  validate (value?: any, args?: ValidationArguments): boolean {
    if (value == null) {
      return true
    }

    if (typeof value !== 'string') {
      return false
    }

    return value.trim().length > 0
  }

}

/**
 * Verify string is not blank.
 *
 * Validator validates only string values, everything else is considered valid.
 */
export function IsNotBlank (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotBlankConstraint
    })
  }
}
