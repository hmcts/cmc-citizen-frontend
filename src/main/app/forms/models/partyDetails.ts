import { IsDefined, MaxLength, ValidateIf, ValidateNested, Validator } from 'class-validator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'
import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'

export class ValidationErrors {
  static readonly ADDRESS_REQUIRED = 'Enter an address'
  static readonly CORRESPONDENCE_ADDRESS_REQUIRED = 'Enter a correspondence address'
  static readonly NAME_REQUIRED: string = 'Enter name'
  static readonly NAME_TOO_LONG: string = 'Name must be no longer than $constraint1 characters'
}

export class PartyDetails implements Serializable<PartyDetails> {
  type?: string

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED, groups: ['claimant', 'defendant'] })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED, groups: ['claimant', 'defendant'] })
  @MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG, groups: ['claimant', 'defendant'] })
  name?: string

  @IsDefined({ message: ValidationErrors.ADDRESS_REQUIRED, groups: ['claimant', 'defendant'] })
  @ValidateNested({ groups: ['claimant', 'defendant'] })
  address?: Address = new Address()

  hasCorrespondenceAddress?: boolean

  @ValidateIf(partyDetails => partyDetails.hasCorrespondenceAddress === true, { groups: ['claimant', 'defendant'] })
  @IsDefined({ message: ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED, groups: ['claimant', 'defendant'] })
  @ValidateNested({ groups: ['claimant', 'defendant'] })
  correspondenceAddress?: CorrespondenceAddress

  constructor (name?: string,
               address: Address = new Address(),
               hasCorrespondenceAddress: boolean = false,
               correspondenceAddress: Address = new CorrespondenceAddress()) {
    this.address = address
    this.hasCorrespondenceAddress = hasCorrespondenceAddress
    this.correspondenceAddress = correspondenceAddress
    this.name = name
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
    }
    return this
  }

  isCompleted (...groups: string[]): boolean {
    return new Validator().validateSync(this, { groups: groups }).length === 0
  }
}
