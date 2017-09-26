import { Address as FormAddress } from 'forms/models/address'
import { Address as AddressDto } from 'claims/models/address'

export function convertAddress (addressForm: FormAddress) {

  const address: AddressDto = new AddressDto()
  Object.assign(address, addressForm)

  return address
}
