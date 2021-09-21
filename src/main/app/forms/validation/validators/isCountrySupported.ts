import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'
import { Country } from 'common/country'
import { ErrorLogger } from 'logging/errorLogger'
import { AddressInfoResponse } from '@hmcts/os-places-client'
import { ClientFactory } from 'postcode-lookup/clientFactory'

const postcodeClient = ClientFactory.createOSPlacesClient()
const countryClient = ClientFactory.createPostcodeToCountryClient()

enum BlockedPostcodes {
  ISLE_OF_MAN = 'IM'
}

@ValidatorConstraint({ async: true })
export class CheckCountryConstraint implements ValidatorConstraintInterface {

  async validate (value: any | string, args?: ValidationArguments): Promise<boolean> {
    if (value === undefined || value === null || value === '') {
      return true
    }

    if (value.trim().toUpperCase().startsWith(BlockedPostcodes.ISLE_OF_MAN)) {
      return false
    }

    try {
      const addressInfoResponse: AddressInfoResponse = await postcodeClient.lookupByPostcodeAndDataSet(value, 'DPA,LPI')
      if (!addressInfoResponse.isValid) {
        return false
      }

      addressInfoResponse.addresses
        = this.removeDulpicateAddresses(addressInfoResponse)
      const country = await countryClient.lookupCountry(addressInfoResponse.addresses[0].postcode)
      const countries: Country[] = args.constraints[0]

      return countries.some(result => result.name.toLowerCase() === country.toLowerCase())
    } catch (err) {
      const errorLogger = new ErrorLogger()
      errorLogger.log(err)
      return true
    }
  }

  private removeDulpicateAddresses (addressInfoResponse: AddressInfoResponse) {
    return addressInfoResponse.addresses
      .filter((addresses, index, self) =>
        index === self.findIndex((t) =>
          (t.formattedAddress === addresses.formattedAddress)
        )
      )
  }

  defaultMessage (args: ValidationArguments) {
    return 'Postcode must be in United Kingdom'
  }
}

/**
 * Verify postcode is within accepted list of countries.
 */
export function IsCountrySupported (countries: Country[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [countries],
      validator: CheckCountryConstraint
    })
  }
}
