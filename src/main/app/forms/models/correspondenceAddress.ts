import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'

import { Address } from 'forms/models/address'

export class ValidationErrors {
  static readonly FIRST_LINE_REQUIRED: string = 'Enter first correspondence address line'
  static readonly FIRST_LINE_TOO_LONG: string = 'The correspondence address line must be no longer than $constraint1 characters'

  static readonly SECOND_LINE_TOO_LONG: string = 'The second correspondence address line must be no longer than $constraint1 characters'

  static readonly CITY_NOT_VALID: string = 'The correspondence address city must be no longer than $constraint1 characters'

  static readonly POSTCODE_REQUIRED: string = 'Enter correspondence address postcode'
  static readonly POSTCODE_NOT_VALID: string = 'The correspondence address postcode must be no longer than $constraint1 characters'
}

export class CorrespondenceAddress extends Address {

  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(50, { message: ValidationErrors.FIRST_LINE_TOO_LONG })
  line1?: string
  @MaxLength(50, { message: ValidationErrors.SECOND_LINE_TOO_LONG })
  line2?: string
  @MaxLength(50, { message: ValidationErrors.CITY_NOT_VALID })
  city?: string
  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED })
  @MaxLength(8, { message: ValidationErrors.POSTCODE_NOT_VALID })
  postcode?: string

}
