import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'

export class Party implements Serializable<Party> {
  type: string
  name: string
  address: Address
  correspondenceAddress?: Address
  mobilePhone?: string
  email?: string

  constructor (type?: string,
              name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: string,
              email?: string ) {
    this.type = type
    this.name = name
    this.address = address
    this.correspondenceAddress = correspondenceAddress
    this.mobilePhone = mobilePhone
    this.email = email
  }

  deserialize (input: any): Party {
    if (input) {
      if (input.name) {
        this.name = input.name
      }
      this.type = input.type
      this.name = input.name
      if (input.mobilePhone) {
        this.mobilePhone = input.mobilePhone
      }
      if (input.address) {
        this.address = new Address().deserialize(input.address)
      }
      if (input.correspondenceAddress) {
        this.correspondenceAddress = new Address().deserialize(input.correspondenceAddress)
      }
    }
    return this
  }
}
