import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class IsLessThanOrEqualToConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value === undefined) {
      return true
    }

    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]

    return typeof value === 'number' && typeof relatedValue === 'number' && value <= relatedValue
  }
}

export function IsLessThanOrEqualTo (property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsLessThanOrEqualToConstraint
    })
  }
}
