import { Address } from 'claims/models/address'
import { PartyType } from 'app/common/partyType'

export class Party {
  type: string
  name: string
  address: Address
  correspondenceAddress?: Address
  mobilePhone?: string
  email?: string

  constructor (
              type?: string,
              name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: string, email?: string) {
    this.type = type
    this.name = name
    this.address = address
    this.correspondenceAddress = correspondenceAddress
    this.mobilePhone = mobilePhone
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
      this.mobilePhone = input.mobilePhone
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
