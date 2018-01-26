import { Form, FormValidationError } from 'forms/form'
import { ValidationError } from 'class-validator'
import { PartyDetails } from 'forms/models/partyDetails'
import * as config from 'config'
import { request } from 'client/request'
import { PostcodeInfoClient, PostcodeInfoResponse } from '@hmcts/postcodeinfo-client'

const postcodeClient = new PostcodeInfoClient(config.get<string>('postcodeLookup.apiKey'), request)

export class PostcodeInfoCountry {
  readonly GSS_CODE: string
  readonly name: string
}

export class Country {
  static readonly WALES = new Country('wales', 'Wales')
  static readonly ENGLAND = new Country('england', 'England')
  static readonly SCOTLAND = new Country('scotland', 'Scotland')
  static readonly NORTHERN_IRELAND = new Country('northernIreland', 'Northern Ireland')

  readonly value: string
  readonly name: string

  constructor (value: string, name: string) {
    this.value = value
    this.name = name
  }

  static all (): Country[] {
    return [
      Country.WALES,
      Country.ENGLAND,
      Country.SCOTLAND,
      Country.NORTHERN_IRELAND
    ]
  }

  static defendantCountries (): Country[] {
    return [
      Country.WALES,
      Country.ENGLAND
    ]
  }

  static async isValidClaimantAddress (form: Form<PartyDetails>): Promise<Form<PartyDetails>> {
    await this.getCountry(form.model.address.postcode).then((country: string) => {
      if (country.length > 0 && !Country.isClaimantCountry(country)) {
        let error = new ValidationError()
        error.property = 'address[postcode]'
        error.constraints = { amount: 'The country must be England, Wales, Scotland or Northern Ireland' }
        form.errors.push(new FormValidationError(error))
      }
    })

    if (form.model.hasCorrespondenceAddress) {
      await this.getCountry(form.model.address.postcode).then((country: string) => {
        if (country.length > 0 && !Country.isClaimantCountry(country)) {
          let error = new ValidationError()
          error.property = 'correspondenceAddress[postcode]'
          error.constraints = { amount: 'The country must be England, Wales, Scotland or Northern Ireland' }
          form.errors.push(new FormValidationError(error))
        }
      })
    }

    return form
  }

  static async isValidDefendantAddress (form: Form<PartyDetails>): Promise<Form<PartyDetails>> {
    await this.getCountry(form.model.address.postcode).then((country: string) => {
      if (country.length > 0 && !Country.isDefendantCountry(country)) {
        let error = new ValidationError()
        error.property = 'address[postcode]'
        error.constraints = { amount: 'The country must be England or Wales' }
        form.errors.push(new FormValidationError(error))
      }
    })

    if (form.model.hasCorrespondenceAddress) {
      await this.getCountry(form.model.address.postcode).then((country: string) => {
        if (country.length > 0 && !Country.isDefendantCountry(country)) {
          let error = new ValidationError()
          error.property = 'correspondenceAddress[postcode]'
          error.constraints = { amount: 'The country must be England or Wales' }
          form.errors.push(new FormValidationError(error))
        }
      })
    }

    return form
  }

  static isClaimantCountry (value: string): boolean {
    return Country.all().filter(country => country.name.toLowerCase() === value.toLowerCase()).length > 0
  }

  static isDefendantCountry (value: string): boolean {
    return Country.defendantCountries().filter(country => country.name.toLowerCase() === value.toLowerCase()).length > 0
  }

  static async getCountry (postcode: string): Promise<string> {
    if (postcode === undefined || postcode.length === 0) {
      return ''
    } else {
      let country = ''
      await postcodeClient.lookupPostcode(postcode)
        .then((postcodeInfoResponse: PostcodeInfoResponse) => {
          if (postcodeInfoResponse.valid) {
            const object: PostcodeInfoCountry = postcodeInfoResponse.country as any as PostcodeInfoCountry
            country = object.name
          }
        })
      return country
    }
  }

  static valueOf (value: string): Country {
    return Country.all()
      .filter(country => country.value === value)
      .pop()
  }
}
