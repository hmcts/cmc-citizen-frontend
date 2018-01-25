import { Form, FormValidationError } from 'forms/form'
import { ValidationError } from 'class-validator'
import { PartyDetails } from 'forms/models/partyDetails'

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

  static isValidClaimantAddress (form: Form<PartyDetails>, country: string): Form<PartyDetails> {
    if (!this.isClaimantCountry(country)) {
      let error = new ValidationError()
      error.property = 'address[country]'
      error.constraints = { amount: 'The country must be England, Wales, Scotland or Northern Ireland' }
      form.errors.push(new FormValidationError(error))
    }

    if (form.model.hasCorrespondenceAddress && !this.isClaimantCountry(form.model.correspondenceAddress.country)) {
      let error = new ValidationError()
      error.property = 'correspondenceAddress[country]'
      error.constraints = { amount: 'The country must be England, Wales, Scotland or Northern Ireland' }
      form.errors.push(new FormValidationError(error))
    }
    return form
  }

  static isValidDefendantAddress (form: Form<PartyDetails>, country: string): Form<PartyDetails> {
    if (!this.isDefendantCountry(country)) {
      let error = new ValidationError()
      error.property = 'address[country]'
      error.constraints = { amount: 'The country must be England or Wales' }
      form.errors.push(new FormValidationError(error))
    }

    if (form.model.hasCorrespondenceAddress && !this.isDefendantCountry(form.model.correspondenceAddress.country)) {
      let error = new ValidationError()
      error.property = 'correspondenceAddress[country]'
      error.constraints = { amount: 'The country must be England or Wales' }
      form.errors.push(new FormValidationError(error))
    }
    return form
  }

  static isClaimantCountry (value: string): boolean {
    return Country.all().filter(country => country.name.toLowerCase() === value.toLowerCase()).length > 0
  }

  static isDefendantCountry (value: string): boolean {
    return Country.defendantCountries().filter(country => country.name.toLowerCase() === value.toLowerCase()).length > 0
  }

  static valueOf (value: string): Country {
    return Country.all()
      .filter(country => country.value === value)
      .pop()
  }
}
