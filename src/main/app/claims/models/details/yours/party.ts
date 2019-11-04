import { Address } from 'claims/models/address'
import { PartyType } from 'common/partyType'

export class Party {
  type: string
  title?: string
  firstName?: string
  lastName?: string
  name: string
  address: Address
  correspondenceAddress?: Address
  phone?: string
  email?: string

  constructor (
    type?: string,
    name?: string,
    address?: Address,
    correspondenceAddress?: Address,
    phone?: string,
    email?: string
  ) {
    this.type = type
    this.name = name
    this.address = address
    this.correspondenceAddress = correspondenceAddress
    this.phone = phone
    this.email = email
  }

  isBusiness (): boolean {
    return this.type === PartyType.COMPANY.value || this.type === PartyType.ORGANISATION.value
  }

  deserialize (input: any): Party {
    if (input) {
      this.name = input.name
      this.type = input.type
      this.email = input.email
      this.phone = input.phone || input.mobilePhone
      if (input.title) {
        this.title = input.title
      }
      if (input.firstName) {
        this.firstName = input.firstName
      }
      if (input.lastName) {
        this.lastName = input.lastName
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
