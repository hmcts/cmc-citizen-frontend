export class PartyType {
  static readonly INDIVIDUAL = new PartyType('individual', 'as an individual')
  static readonly SOLE_TRADER_OR_SELF_EMPLOYED = new PartyType('soleTrader', 'as a sole trader or self-employed person')
  static readonly COMPANY = new PartyType('company', 'on behalf of a company')
  static readonly ORGANISATION = new PartyType('organisation', 'on behalf of an organisation')
  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): PartyType[] {
    return [
      PartyType.INDIVIDUAL,
      PartyType.SOLE_TRADER_OR_SELF_EMPLOYED,
      PartyType.COMPANY,
      PartyType.ORGANISATION
    ]
  }
}
