export class PartyType {
  static readonly INDIVIDUAL = new PartyType('INDIVIDUAL', 'Individual')
  static readonly SOLE_TRADER_OR_SELF_EMPLOYED = new PartyType('SOLE_TRADER_OR_SELF_EMPLOYED', 'Sole Trader')
  static readonly COMPANY = new PartyType('COMPANY', 'Company')
  static readonly ORGANISATION = new PartyType('ANOTHER_ORGANISATION', 'Organisation')
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
