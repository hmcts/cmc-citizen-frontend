export class PartyType {
  static readonly INDIVIDUAL = new PartyType('individual', 'Individual')
  static readonly SOLE_TRADER_OR_SELF_EMPLOYED = new PartyType('soleTrader', 'Sole trader')
  static readonly COMPANY = new PartyType('company', 'Company')
  static readonly ORGANISATION = new PartyType('organisation', 'Organisation')

  readonly value: string
  readonly name: string

  constructor (value: string, name: string) {
    this.value = value
    this.name = name
  }

  static all (): PartyType[] {
    return [
      PartyType.INDIVIDUAL,
      PartyType.SOLE_TRADER_OR_SELF_EMPLOYED,
      PartyType.COMPANY,
      PartyType.ORGANISATION
    ]
  }

  static except (partyType: PartyType): PartyType[] {
    if (partyType === undefined) {
      throw new Error('Party type is required')
    }
    return PartyType.all().filter(_ => _.value !== partyType.value)
  }

  static valueOf (value: string): PartyType {
    return PartyType.all()
      .filter(type => type.value === value)
      .pop()
  }
}
