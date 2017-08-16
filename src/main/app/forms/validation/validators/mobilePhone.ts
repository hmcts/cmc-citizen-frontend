import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint()
export class IsMobilePhoneConstraint implements ValidatorConstraintInterface {

  validate (value?: any, args?: ValidationArguments): boolean {
    if (value == null) {
      return true
    }

    if (typeof value !== 'string') {
      return false
    }

    value = value.replace(/\(|\)| |-|\+/g, '').replace(/^(00)?44/, '').replace(/^0/, '')
    return value.startsWith('7') && value.length === 10
  }

}

/**
 * Verify a valid UK mobile number.
 *
 * The validation is aligned to match what GOV.UK Notify is accepting.
 */
export function IsMobilePhone (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMobilePhoneConstraint
    })
  }
}
