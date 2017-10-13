import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class MaxLengthValidatorConstraint implements ValidatorConstraintInterface {

  validate (value: any, args?: ValidationArguments): boolean {
    const [maxLength] = args.constraints

    if (maxLength < 0) {
      throw new Error('Max length must be > 0')
    }

    return (value === undefined) || (value && value.length <= maxLength)
  }

}

export function MaxLength (maxLength: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxLength],
      validator: MaxLengthValidatorConstraint
    })
  }
}
