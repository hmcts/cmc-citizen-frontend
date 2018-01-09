import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint()
export class AllFieldsArePopulatedConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    return args.constraints.every(field => args.object[field] && !!args.object[field].trim())
  }
}

/**
 * Verifies if all of the fields in given object are populated with "truthy" value.
 */
export function AllFieldsArePopulated (fields: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: fields,
      validator: AllFieldsArePopulatedConstraint
    })
  }
}
