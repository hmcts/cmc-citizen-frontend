import { Party } from 'claims/models/details/yours/party'
import { Company } from 'claims/models/details/yours/company'
import { SoleTrader } from 'claims/models/details/yours/soleTrader'
import { Organisation } from 'claims/models/details/yours/organisation'
import { PartyType } from 'app/common/partyType'

export class PartyDetailsMapper {
  static createPartyDetails (party: Party, email: string): object {
    const data = {
      type: this.partyTypeAsString(party),
      fullName: party.name,
      contactPerson: this.contactPerson(party),
      businessName: this.businessName(party),
      address: {
        lineOne: party.address.line1,
        lineTwo: party.address.line2,
        lineThree: party.address.line3,
        townOrCity: party.address.city,
        country: party.address.country,
        postcode: party.address.postcode
      },
      email: email
    }
    if (party.correspondenceAddress) {
      data['correspondenceAddress'] = {
        lineOne: party.correspondenceAddress.line1,
        lineTwo: party.correspondenceAddress.line2,
        lineThree: party.correspondenceAddress.line3,
        townOrCity: party.correspondenceAddress.city,
        country: party.correspondenceAddress.country,
        postcode: party.correspondenceAddress.postcode
      }
    }
    return data
  }

  static partyTypeAsString (partyDetails: Party): string {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          return PartyType.INDIVIDUAL.name
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          return PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.name
        case PartyType.COMPANY.value:
          return PartyType.COMPANY.name
        case PartyType.ORGANISATION.value:
          return PartyType.ORGANISATION.name
        default:
          return undefined
      }
    }
  }
  static businessName (partyDetails: Party): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
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
