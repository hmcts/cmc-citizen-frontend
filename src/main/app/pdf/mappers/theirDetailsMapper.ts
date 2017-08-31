import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { Company } from 'claims/models/details/theirs/company'
import { SoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Organisation } from 'claims/models/details/theirs/organisation'
import { PartyType } from 'forms/models/partyType'
export class TheirDetailsMapper {
  static createTheirDetails (party: TheirDetails, email: string): object {
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
    return data
  }

  static businessName (partyDetails: TheirDetails): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.ORGANISATION.value:
          return (partyDetails as SoleTrader).businessName
      }
    }
    return undefined
  }

  static contactPerson (partyDetails: TheirDetails): any {
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
