import Party from 'app/claims/models/party'

export class PartyDetailsMapper {
  static createPersonalDetails (party: Party, email: string): object {
    let data = {
      fullName: party.name,
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
}
