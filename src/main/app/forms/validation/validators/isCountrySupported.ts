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

const postcodeClient = new PostcodeInfoClient(config.get<string>('postcodeLookup.apiKey'), request)

@ValidatorConstraint()
export class CheckCountryConstraint implements ValidatorConstraintInterface {

  async validate (value: any | string, args?: ValidationArguments): Promise<boolean> {
    if (value === undefined || value === null || value === '') {
      return true
    }
    try {
      const postcodeInfoResponse: PostcodeInfoResponse = await postcodeClient.lookupPostcode(value)
      if (!postcodeInfoResponse.valid) {
        return true
      }
      const country = postcodeInfoResponse.country.name
      const countries: Country[] = args.constraints[0]

      return countries.filter(result => result.name.toLowerCase() === country.toLowerCase()).length > 0
    } catch (err) {
      return true
    }
  }

  defaultMessage (args: ValidationArguments) {
    return 'Country is not supported'
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
