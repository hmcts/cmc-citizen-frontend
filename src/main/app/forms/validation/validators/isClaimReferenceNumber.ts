import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'
import { isCMCReference } from 'shared/utils/isCMCReference'
import { isCCBCCaseReference } from 'shared/utils/isCCBCCaseReference'

@ValidatorConstraint()
export class CheckClaimReferenceNumberConstraint implements ValidatorConstraintInterface {

  validate (value: any | string, args?: ValidationArguments): boolean {
    if (value === undefined || value === '') {
      return true
    }

    return isCMCReference(value) || isCCBCCaseReference(value)
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
