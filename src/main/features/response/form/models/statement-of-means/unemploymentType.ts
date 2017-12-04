export class UnemploymentType {

  static readonly UNEMPLOYED = new UnemploymentType('UNEMPLOYED', 'Unemployed')
  static readonly RETIRED = new UnemploymentType('RETIRED', 'Retired')
  static readonly OTHER = new UnemploymentType('OTHER', 'Other')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): UnemploymentType[] {
    return [
      UnemploymentType.UNEMPLOYED,
      UnemploymentType.RETIRED,
      UnemploymentType.OTHER
    ]
  }

  static valueOf (value: string): UnemploymentType {
    return UnemploymentType.all()
      .filter(type => type.value === value)
      .pop()
  }
}
