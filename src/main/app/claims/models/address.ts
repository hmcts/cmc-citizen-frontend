export class Address {

  line1: string
  line2?: string
  line3?: string
  city?: string
  postcode: string

  deserialize (input?: any): Address {
    if (input) {
      this.line1 = input.line1
      this.line2 = input.line2
      this.line3 = input.line3
      this.city = input.city
      this.postcode = input.postcode
    }
    return this
  }

}
