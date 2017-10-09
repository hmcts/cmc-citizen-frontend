import { Address as FormAddress } from 'forms/models/address'
import { Address } from 'claims/models/address'

export function convertAddress (addressForm: FormAddress) {

  const address: Address = new Address()
  Object.assign(address, addressForm)

  return address
}
