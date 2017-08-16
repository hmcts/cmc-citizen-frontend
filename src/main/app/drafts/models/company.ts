import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'

// Not used in main code at the moment, we will need this later when we start supporting other defendant types.
// Used in tests to verify that DraftClaim can support different defendant types
export default class Company implements Serializable<Company> {
  address: Address

  deserialize (input: any): Company {
    if (input) {
      this.address = new Address().deserialize(input.address)
    }
    return this
  }
}
