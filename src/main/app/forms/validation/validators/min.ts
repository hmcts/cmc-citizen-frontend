import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint()
export class MinConstraint implements ValidatorConstraintInterface {

  validate (value: any, args?: ValidationArguments): boolean {

    const [minValue] = args.constraints

    return (value === undefined) || (value >= minValue)
  }
}

/**
 * Validates only values greater or equal given min value. `undefined` is also valid
 */
export function Min (minValue: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minValue],
      validator: MinConstraint
    })
  }
}
