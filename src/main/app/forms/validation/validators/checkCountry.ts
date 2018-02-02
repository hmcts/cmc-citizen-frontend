import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { Country } from 'app/common/country'

import { PostcodeInfoClient, PostcodeInfoResponse } from '@hmcts/postcodeinfo-client'
import * as config from 'config'
import { request } from 'client/request'
import { ValidationErrors as AddressValidationErrors } from 'app/forms/models/address'

const postcodeClient = new PostcodeInfoClient(config.get<string>('postcodeLookup.apiKey'), request)

@ValidatorConstraint()
export class CheckCountryConstraint implements ValidatorConstraintInterface {

  async validate (value: any | string, args?: ValidationArguments): Promise<boolean> {
    if (value === undefined || value === null || value === '') {
      return false
    }
    const postcodeInfoResponse: PostcodeInfoResponse = await postcodeClient.lookupPostcode(value)
    if (!postcodeInfoResponse.valid) {
      return true
    }
    const country = postcodeInfoResponse.country.name
    const countries: Country[] = args.constraints[0]

    return countries.filter(result => result.name.toLowerCase() === country.toLowerCase()).length > 0
  }

  defaultMessage (args: ValidationArguments) {
    const countries: Country[] = args.constraints[0]
    if (args.value === undefined || args.value === null || args.value === '') {
      return AddressValidationErrors.POSTCODE_REQUIRED
    } else if (countries.length === 4) {
      return AddressValidationErrors.CLAIMANT_COUNTRY_REQUIRED
    } else if (countries.length === 2) {
      return AddressValidationErrors.DEFENDANT_COUNTRY_REQUIRED
    } else {
      return AddressValidationErrors.POSTCODE_REQUIRED
    }
  }
}

/**
 * Verify is a within age limit.
 */
export function CheckCountry (countries: Country[], validationOptions?: ValidationOptions) {
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
