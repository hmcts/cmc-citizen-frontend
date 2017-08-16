import { Address } from 'forms/models/address'
import { IsDefined, ValidateIf, ValidateNested } from 'class-validator'
import { Serializable } from 'models/serializable'
import { CompletableTask } from 'models/task'
import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'

export class ValidationErrors {
  static readonly ADDRESS_REQUIRED = 'Enter an address'
  static readonly CORRESPONDENCE_ADDRESS_REQUIRED = 'Enter a correspondence address'
}

export class PartyDetails implements Serializable<PartyDetails>, CompletableTask {

  @IsDefined({ message: ValidationErrors.ADDRESS_REQUIRED })
  @ValidateNested()
  address?: Address

  hasCorrespondenceAddress?: boolean

  @ValidateIf(partyDetails => partyDetails.hasCorrespondenceAddress === true)
  @IsDefined({ message: ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED })
  @ValidateNested()
  correspondenceAddress?: CorrespondenceAddress

  constructor (
    address: Address = new Address(),
    hasCorrespondenceAddress: boolean = false,
    correspondenceAddress: Address = new CorrespondenceAddress()
  ) {
    this.address = address
    this.hasCorrespondenceAddress = hasCorrespondenceAddress
    this.correspondenceAddress = correspondenceAddress
  }

  static fromObject (input?: any): PartyDetails {
    if (input == null) {
      return input
    }

    let deserialized: PartyDetails = new PartyDetails(
      new Address().deserialize(input.address),
      input.hasCorrespondenceAddress === 'true',
      new CorrespondenceAddress().deserialize(input.correspondenceAddress)
    )

    if (deserialized.hasCorrespondenceAddress === false) {
      deserialized.correspondenceAddress = undefined
    }

    return deserialized
  }

  deserialize (input: any): PartyDetails {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.hasCorrespondenceAddress = input.hasCorrespondenceAddress
      this.correspondenceAddress = new CorrespondenceAddress().deserialize(input.correspondenceAddress)
    }
    return this
  }

  isCompleted (): boolean {
    let isCompleted: boolean = this.address !== undefined && this.address.isCompleted()
    if (this.hasCorrespondenceAddress) {
      isCompleted = isCompleted && this.correspondenceAddress !== undefined && this.correspondenceAddress.isCompleted()
    }
    return isCompleted
  }

}
