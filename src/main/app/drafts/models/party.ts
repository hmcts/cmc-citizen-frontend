import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'
import { PartyType } from 'forms/models/partyType'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import Payment from 'app/pay/payment'

export default class Party implements Serializable<Party> {
  payment: Payment = new Payment()
  address: Address = new Address()
  correspondenceAddress: Address = new Address()
  type: PartyType
  deserialize (input: any): Party {
    if (input) {
      if (input.address) {
        this.address = new Address().deserialize(input.address)
      }
      if (input.correspondenceAddress) {
        this.correspondenceAddress = new Address().deserialize(input.correspondenceAddress)
      }
      if (input.type) {
        this.type = PartyTypeResponse.fromObject(input.type).type
      }
      if (input.payment) {
        this.payment = new Payment().deserialize(input.payment)
      }
    }
    return this
  }
}
