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

  static valueOf (value: string): Country {
    return Country.all()
      .filter(country => country.value === value)
      .pop()
  }
}
