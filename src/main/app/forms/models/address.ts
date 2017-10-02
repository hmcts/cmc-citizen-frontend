import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'

import { Serializable } from 'models/serializable'
import { CompletableTask } from 'app/models/task'
import { Address as ClaimAddress } from 'claims/models/address'

export class ValidationErrors {
  static readonly FIRST_LINE_REQUIRED: string = 'Enter first address line'
  static readonly FIRST_LINE_TOO_LONG: string = 'The address line must be no longer than $constraint1 characters'

  static readonly SECOND_LINE_TOO_LONG: string = 'The second address line must be no longer than $constraint1 characters'

  static readonly CITY_REQUIRED: string = 'Enter a valid town/city'
  static readonly CITY_NOT_VALID: string = 'The city must be no longer than $constraint1 characters'

  static readonly POSTCODE_REQUIRED: string = 'Enter postcode'
  static readonly POSTCODE_NOT_VALID: string = 'The postcode must be no longer than $constraint1 characters'
}

export class ValidationConstants {
  static readonly ADDRESS_MAX_LENGTH: number = 100
  static readonly POSTCODE_MAX_LENGTH: number = 8
}

export class Address implements Serializable<Address>, CompletableTask {

  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.FIRST_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
  line1?: string
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.SECOND_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
  line2?: string
  @IsDefined({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @IsNotBlank({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.CITY_NOT_VALID, groups: ['claimant', 'defendant', 'response'] })
  city?: string
  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @MaxLength(ValidationConstants.POSTCODE_MAX_LENGTH, { message: ValidationErrors.POSTCODE_NOT_VALID, groups: ['claimant', 'defendant', 'response'] })
  postcode?: string

  constructor (line1?: string, line2?: string, city?: string, postcode?: string) {
    this.line1 = line1
    this.line2 = line2
    this.city = city
    this.postcode = postcode
  }

  static fromClaimAddress (address: ClaimAddress): Address {
    return new Address(address.line1, address.line2, address.city, address.postcode)
  }

  static fromObject (input?: any): Address {
    if (input == null) {
      return input
    }
    let deserialized: Address = new Address(
        input.line1,
        input.line2,
        input.city,
        input.postcode
    )
    return deserialized
  }

  deserialize (input?: any): Address {
    if (input) {
      this.line1 = input.line1
      this.line2 = input.line2
      this.city = input.city
      this.postcode = input.postcode
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.postcode && this.postcode.length > 0
  }
}
