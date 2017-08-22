import { Serializable } from 'models/serializable'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'
import { Address } from 'claims/models/address'

export class Person implements Serializable<Person> {
  name: string
  address: Address
  correspondenceAddress?: Address
  dateOfBirth?: Moment
  mobilePhone?: string

  deserialize (input: any): Person {
    if (input) {
      this.name = input.name
      this.address = new Address().deserialize(input.address)
      if (input.correspondenceAddress) {
        this.correspondenceAddress = new Address().deserialize(input.correspondenceAddress)
      }
      if (input.dateOfBirth) {
        this.dateOfBirth = MomentFactory.parse(input.dateOfBirth)
      }
      if (input.mobilePhone) {
        this.mobilePhone = input.mobilePhone
      }
    }
    return this
  }
}
