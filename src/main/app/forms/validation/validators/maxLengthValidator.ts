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

    return value === undefined || value.length <= maxLength
  }

}

/**
 * We don't use default @MaxLength from class-validator lib as that validator expects string
 * and returns invalid for `undefined` value (we have undefined value in our form models, at least
 * ClaimAmountRow and TimelineRow).
 */
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
