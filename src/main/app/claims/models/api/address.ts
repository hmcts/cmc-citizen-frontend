import * as form from 'forms/models/address'

export class Address {
  line1: string
  line2: string
  line3: string
  city: string
  postcode: string

  constructor (line1?: string,
               line2?: string,
               line3?: string,
               city?: string,
               postcode?: string) {
    this.line1 = line1
    this.line2 = line2
    this.line3 = line3
    this.city = city
    this.postcode = postcode
  }

  static fromFormAddress (formAddress: form.Address) {
    return new Address(
      formAddress.line1,
      formAddress.line2,
      formAddress.line3,
      formAddress.city,
      formAddress.postcode
    )
  }
}
