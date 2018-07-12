import { Defendant } from 'drafts/models/defendant'
import { Address } from 'claims/models/api/address'

export class PartyContactDetails {
  address?: Address
  correspondenceAddress?: Address
  phoneNumber: string

  constructor (
    address?: Address,
    correspondenceAddress?: Address,
    phoneNumber?: string
  ) {
    this.address = address
    this.correspondenceAddress = correspondenceAddress
    this.phoneNumber = phoneNumber
  }

  static fromDefendant (defendant: Defendant) {
    return new PartyContactDetails(
      Address.fromFormAddress(defendant.partyDetails.address),
      Address.fromFormAddress(defendant.partyDetails.correspondenceAddress),
      defendant.mobilePhone !== undefined ? defendant.mobilePhone.number : null
    )
  }
}
