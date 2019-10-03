import { IsDefined, IsNotEmpty, MaxLength, ValidateIf, ValidateNested, Validator } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { Address } from 'forms/models/address'
import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'
import { PartyType } from 'common/partyType'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly ADDRESS_REQUIRED = 'Enter an address'
  static readonly CORRESPONDENCE_ADDRESS_REQUIRED = 'Enter a correspondence address'
  static readonly NAME_REQUIRED: string = 'Enter name'
  static readonly NAME_TOO_LONG: string = 'Name must be no longer than $constraint1 characters'
  static readonly PHONE_REQUIRED: string = 'You can only change your phone number, not remove it'
}

export class PartyDetails {
  type?: string

  @ValidateIf(o => (o.lastName === undefined && o.firstName === undefined), { groups: ['claimant', 'defendant', 'response'] })
  @IsDefined({ message: ValidationErrors.NAME_REQUIRED, groups: ['claimant', 'defendant'] })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED, groups: ['claimant', 'defendant'] })
  @MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG, groups: ['claimant', 'defendant'] })
  name?: string

  @IsDefined({ message: ValidationErrors.ADDRESS_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @ValidateNested({ groups: ['claimant', 'defendant', 'response'] })
  address?: Address

  hasCorrespondenceAddress?: boolean

  @ValidateIf(o => (o.phone !== undefined), { groups: ['defendant', 'response'] })
  @IsNotEmpty({ message: ValidationErrors.PHONE_REQUIRED, groups: ['defendant','response'] })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  phone?: string

  @ValidateIf(partyDetails => partyDetails.hasCorrespondenceAddress === true, { groups: ['claimant', 'defendant', 'response'] })
  @IsDefined({ message: ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
  @ValidateNested({ groups: ['claimant', 'defendant', 'response'] })
  correspondenceAddress?: CorrespondenceAddress

  constructor (name?: string,
               address: Address = new Address(),
               hasCorrespondenceAddress: boolean = false,
               correspondenceAddress: Address = new CorrespondenceAddress(),
               phone?: string) {
    this.address = address
    this.hasCorrespondenceAddress = hasCorrespondenceAddress
    this.correspondenceAddress = correspondenceAddress
    this.name = name
    this.phone = phone
  }

  static fromObject (input?: any): PartyDetails {
    if (input == null) {
      return input
    }
    const deserialized: PartyDetails = new PartyDetails(
      input.name,
      new Address().deserialize(input.address),
      input.hasCorrespondenceAddress === 'true',
      new CorrespondenceAddress().deserialize(input.correspondenceAddress)
    )
    if (deserialized.hasCorrespondenceAddress === false) {
      deserialized.correspondenceAddress = undefined
    }
    deserialized.type = input.type

    if (input.phone !== undefined) {
      deserialized.phone = input.phone
    }
    return deserialized
  }

  deserialize (input?: any): PartyDetails {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.type = input.type
      this.name = input.name
      this.address = new Address().deserialize(input.address)
      this.hasCorrespondenceAddress = input.hasCorrespondenceAddress
      this.correspondenceAddress = new CorrespondenceAddress().deserialize(input.correspondenceAddress)
      if (input.phone !== undefined) {
        this.phone = input.phone
      }
    }
    return this
  }

  isCompleted (...groups: string[]): boolean {
    return new Validator().validateSync(this, { groups: groups }).length === 0
  }

  isBusiness (): boolean {
    return this.type === PartyType.COMPANY.value || this.type === PartyType.ORGANISATION.value
  }
}
