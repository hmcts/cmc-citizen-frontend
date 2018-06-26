import { PartyDetails } from 'forms/models/partyDetails'
import { Address } from 'forms/models/address'
import { CorrespondenceAddress } from 'forms/models/correspondenceAddress'

// dto matching API's TheirDetails, to be removed
export class TheirDetails {
  name?: string
  address?: Address
  email?: string
  representative?: object
  serviceAddress?: CorrespondenceAddress
  type: string

  constructor (
    name?: string,
    address?: Address,
    email?: string,
    // todo no class for representative, sending null
    representative?: object,
    serviceAddress?: CorrespondenceAddress,
    type?: string
  ) {
    this.name = name
    this.address = address
    this.email = email
    this.representative = representative
    this.serviceAddress = serviceAddress
    this.type = type
  }

  static fromPartyDetails (party: PartyDetails) {
    return new TheirDetails(
      party.name,
      party.address,
      '',
      null,
      party.correspondenceAddress,
      'individual'
    )
  }
}
