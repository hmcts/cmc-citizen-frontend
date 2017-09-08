import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'

import { Address } from 'forms/models/address'

export class ValidationErrors {
  static readonly FIRST_LINE_REQUIRED: string = 'Enter first correspondence address line'
  static readonly FIRST_LINE_TOO_LONG: string = 'The correspondence address line must be no longer than $constraint1 characters'

  static readonly SECOND_LINE_TOO_LONG: string = 'The second correspondence address line must be no longer than $constraint1 characters'

  static readonly CITY_REQUIRED: string = 'Enter correspondence town/city'
  static readonly CITY_NOT_VALID: string = 'The correspondence address city must be no longer than $constraint1 characters'

  static readonly POSTCODE_REQUIRED: string = 'Enter correspondence address postcode'
  static readonly POSTCODE_NOT_VALID: string = 'The correspondence address postcode must be no longer than $constraint1 characters'
}

export class ValidationConstants {
  static readonly ADDRESS_MAX_LENGTH: number = 100
  static readonly POSTCODE_MAX_LENGTH: number = 8
}

export class CorrespondenceAddress extends Address {

  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.FIRST_LINE_TOO_LONG })
  line1?: string
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.SECOND_LINE_TOO_LONG })
  line2?: string
  @IsDefined({ message: ValidationErrors.CITY_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CITY_REQUIRED })
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.CITY_NOT_VALID })
  city?: string
  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED })
  @MaxLength(ValidationConstants.POSTCODE_MAX_LENGTH, { message: ValidationErrors.POSTCODE_NOT_VALID })
  postcode?: string
}
