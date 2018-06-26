import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'
import { Address } from 'forms/models/address'
import { Defendant } from 'drafts/models/defendant'

export class PartyContactDetails {
  address?: Address
  correspondenceAddress?: CorrespondenceAddress
  phoneNumber: string

  constructor (
    address?: Address,
    correspondenceAddress?: CorrespondenceAddress,
    phoneNumber?: string
  ) {
    this.address = address
    this.correspondenceAddress = correspondenceAddress
    this.phoneNumber = phoneNumber
  }

  static fromDefendant (defendant: Defendant) {
    return new PartyContactDetails(
      defendant.partyDetails.address,
      defendant.partyDetails.correspondenceAddress,
      defendant.mobilePhone !== undefined ? defendant.mobilePhone.number : null
    )
  }
}
