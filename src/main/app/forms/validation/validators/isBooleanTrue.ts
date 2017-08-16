import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint()
export class IsBooleanTrueConstraint implements ValidatorConstraintInterface {

  validate (value: any, args?: ValidationArguments): boolean {
    return typeof value === 'boolean' && (value === true)
  }

}

/**
 * Validator validates only boolean true values, everything else is considered invalid.
 */
export function IsBooleanTrue (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBooleanTrueConstraint
    })
  }
}
