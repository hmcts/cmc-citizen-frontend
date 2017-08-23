import { IsDefined, ValidateNested, ValidateIf, MaxLength } from 'class-validator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { Serializable } from 'models/serializable'
import { CompletableTask } from 'app/models/task'
import { Address } from 'forms/models/address'
import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'

export class ValidationErrors {
  static readonly ADDRESS_REQUIRED = 'Enter an address'
  static readonly CORRESPONDENCE_ADDRESS_REQUIRED = 'Enter a correspondence address'
  static readonly NAME_REQUIRED: string = 'Enter name'
  static readonly NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export class PartyDetails implements Serializable<PartyDetails>, CompletableTask {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG })
  name?: string

  @IsDefined({ message: ValidationErrors.ADDRESS_REQUIRED })
  @ValidateNested()
  address?: Address = new Address()
  type?: string

  hasCorrespondenceAddress?: boolean

  @ValidateIf(partyDetails => partyDetails.hasCorrespondenceAddress === true)
  @IsDefined({ message: ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED })
  @ValidateNested()
  correspondenceAddress?: CorrespondenceAddress

  constructor (
    name: string = undefined,
    address: Address = new Address(),
    hasCorrespondenceAddress: boolean = false,
    correspondenceAddress: Address = new CorrespondenceAddress()
  ) {
    this.address = address
    this.hasCorrespondenceAddress = hasCorrespondenceAddress
    this.correspondenceAddress = correspondenceAddress
    this.name = name
  }

  static fromObject (input?: any): PartyDetails {
    if (input == null) {
      return input
    }
    let deserialized: PartyDetails = new PartyDetails(
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
      this.hasCorrespondenceAddress = input.hasCorrespondenceAddress === 'true' || input.hasCorrespondenceAddress === true
      this.correspondenceAddress = new CorrespondenceAddress().deserialize(input.correspondenceAddress)
    }
    return this
  }

  isCompleted (): boolean {
    let isCompleted: boolean = this.address !== undefined && this.address.isCompleted() && !!this.name && this.name.length > 0
    if (this.hasCorrespondenceAddress) {
      isCompleted = isCompleted && this.correspondenceAddress !== undefined && this.correspondenceAddress.isCompleted()
    }
    return isCompleted
  }
}
