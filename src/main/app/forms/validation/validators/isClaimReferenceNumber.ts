import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { isCMCReference } from 'common/utils/isCMCReference'
import { isCCBCCaseReference } from 'common/utils/isCCBCCaseReference'

@ValidatorConstraint()
export class CheckClaimReferenceNumberConstraint implements ValidatorConstraintInterface {

  validate (value: any | string, args?: ValidationArguments): boolean {
    if (value === undefined || value === null || value === '') {
      return true
    }

    return isCMCReference(value) || isCCBCCaseReference(value)
  }

  defaultMessage (args: ValidationArguments) {
    return 'Enter a valid reference number'
  }
}

/**
 * Verify claim reference is valid.
 */
export function IsClaimReferenceNumber (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CheckClaimReferenceNumberConstraint
    })
  }
}
