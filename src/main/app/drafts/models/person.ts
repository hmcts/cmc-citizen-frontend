import { Serializable } from 'models/serializable'
import { Name } from 'app/forms/models/name'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { PartyDetails } from 'forms/models/partyDetails'

export default class Person implements Serializable<Person> {
  name: Name
  partyDetails: PartyDetails = new PartyDetails()
  dateOfBirth?: DateOfBirth
  mobilePhone?: MobilePhone

  deserialize (input: any): Person {
    if (input) {
      if (input.name) {
        this.name = new Name().deserialize(input.name)
      }
      if (input.partyDetails) {
        this.partyDetails = new PartyDetails().deserialize(input.partyDetails)
      }
      if (input.dateOfBirth) {
        this.dateOfBirth = new DateOfBirth().deserialize(input.dateOfBirth)
      }
      if (input.mobilePhone) {
        this.mobilePhone = new MobilePhone().deserialize(input.mobilePhone)
      }
    }
    return this
  }
}
