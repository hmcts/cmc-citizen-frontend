import {
  IsDefined,
  MaxLength,
  Validate
} from '@hmcts/class-validator'
import { Address } from 'forms/models/address'
import { IsNotBlank, IsValidPostcode } from '@hmcts/cmc-validators'
import { PostcodeNotInScotlandOrNIValidator } from 'forms/validation/validators/postCodeNotInScotlandOrNI'

export class ValidationErrors {
  static readonly FIRST_LINE_REQUIRED: string = 'Enter first correspondence address line'
  static readonly FIRST_LINE_TOO_LONG: string = 'The correspondence address line must be no longer than $constraint1 characters'

  static readonly SECOND_LINE_TOO_LONG: string = 'The second correspondence address line must be no longer than $constraint1 characters'
  static readonly THIRD_LINE_TOO_LONG: string = 'The third correspondence address line must be no longer than $constraint1 characters'

  static readonly CITY_REQUIRED: string = 'Enter correspondence town/city'
  static readonly CITY_NOT_VALID: string = 'The correspondence address city must be no longer than $constraint1 characters'

  static readonly POSTCODE_REQUIRED: string = 'Enter correspondence address postcode'
  static readonly POSTCODE_NOT_VALID: string = 'Postcode must be in United Kingdom'
  static readonly DEFENDANT_POSTCODE_NOT_VALID: string = 'Postcode must be in England or Wales'
}

export class ValidationConstants {
  static readonly ADDRESS_MAX_LENGTH: number = 100
}

export class CorrespondenceAddress extends Address {

  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.FIRST_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
  line1?: string
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.SECOND_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
  line2?: string
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.THIRD_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
  line3?: string
  @IsDefined({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @IsNotBlank({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.CITY_NOT_VALID, groups: ['claimant', 'defendant', 'response'] })
  city?: string
  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @Validate(PostcodeNotInScotlandOrNIValidator, {
    message: ValidationErrors.DEFENDANT_POSTCODE_NOT_VALID,
    groups: ['claimant']
  })
  postcode?: string
}
