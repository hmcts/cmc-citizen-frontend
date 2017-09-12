import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'

export class TheirDetails implements Serializable<TheirDetails> {
  type: string
  name: string
  address: Address
  email?: string

  constructor (type?: string, name?: string, address?: Address, email?: string ) {
    this.type = type
    this.name = name
    this.address = address
    this.email = email
  }

  deserialize (input: any): TheirDetails {
    if (input) {
      this.type = input.type
      this.name = input.name
      if (input.address) {
        this.address = new Address().deserialize(input.address)
      }
      this.email = input.email
    }
    return this
  }
}
