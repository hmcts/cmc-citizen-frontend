import { Serializable } from 'models/serializable'

export class Address implements Serializable<Address> {

  line1: string
  line2?: string
  city?: string
  postcode: string

  deserialize (input?: any): Address {
    if (input) {
      this.line1 = input.line1
      this.line2 = input.line2
      this.city = input.city
      this.postcode = input.postcode
    }
    return this
  }

}
