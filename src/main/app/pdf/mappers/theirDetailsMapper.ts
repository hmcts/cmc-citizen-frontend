import { TheirDetails } from 'claims/models/details/theirs/theirDetails'

export class TheirDetailsMapper {
  static createTheirDetails (party: TheirDetails, email: string): object {
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
    return data
  }
}
