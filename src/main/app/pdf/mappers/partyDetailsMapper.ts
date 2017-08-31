import { Party } from 'claims/models/details/yours/party'
import { Company } from 'claims/models/details/yours/company'
import { SoleTrader } from 'claims/models/details/yours/soleTrader'
import { Organisation } from 'claims/models/details/yours/organisation'
import { PartyType } from 'forms/models/partyType'

export class PartyDetailsMapper {
  static createPartyDetails (party: Party, email: string): object {
    let data = {
      type: party.type,
      fullName: party.name,
      contactPerson: this.contactPerson(party),
      businessName: this.businessName(party),
      address: {
        lineOne: party.address.line1,
        lineTwo: party.address.line2,
        townOrCity: party.address.city,
        postcode: party.address.postcode
      },
      email: email
    }
    if (party.correspondenceAddress) {
      data['correspondenceAddress'] = {
        lineOne: party.correspondenceAddress.line1,
        lineTwo: party.correspondenceAddress.line2,
        townOrCity: party.correspondenceAddress.city,
        postcode: party.correspondenceAddress.postcode
      }
    }
    return data
  }

  static businessName (partyDetails: Party): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.ORGANISATION.value:
          return (partyDetails as SoleTrader).businessName
      }
    }
    return undefined
  }

  static contactPerson (partyDetails: Party): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.COMPANY.value:
          return (partyDetails as Company).contactPerson
        case PartyType.ORGANISATION.value:
          return (partyDetails as Organisation).contactPerson
      }
    }
    return undefined
  }
}
