import { Person } from 'app/claims/models/person'

export class PersonalDetailsMapper {
  static createPersonalDetails (person: Person, email: string): object {
    let data = {
      fullName: person.name,
      address: {
        lineOne: person.address.line1,
        lineTwo: person.address.line2,
        townOrCity: person.address.city,
        postcode: person.address.postcode
      },
      email: email
    }
    if (person.correspondenceAddress) {
      data['correspondenceAddress'] = {
        lineOne: person.correspondenceAddress.line1,
        lineTwo: person.correspondenceAddress.line2,
        townOrCity: person.correspondenceAddress.city,
        postcode: person.correspondenceAddress.postcode
      }
    }
    return data
  }
}
