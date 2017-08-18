import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'
import Email from 'forms/models/email'

export default class TheirDetails implements Serializable<TheirDetails> {
  type: string
  name: string
  address: Address
  email?: string

  constructor (type?: string,
              name?: string,
              address?: Address,
              email?: string ) {
    this.name = name
    this.address = address
    this.email = email
  }

  deserialize (input: any): TheirDetails {
    if (input) {
      if (input.name) {
        this.name = input.name
      }
      this.type = input.type
      this.name = input.name
      if (input.address) {
        this.address = new Address().deserialize(input.address)
      }
      if (input.email) {
        this.email = new Email().deserialize(input.email).address
      }
    }
    return this
  }
}
