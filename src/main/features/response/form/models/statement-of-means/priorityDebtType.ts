export class PriorityDebtType {

  static readonly MORTGAGE = new PriorityDebtType('MORTGAGE', 'Mortgage')
  static readonly RENT = new PriorityDebtType('RENT', 'Rent')
  static readonly COUNCIL_TAX_COMMUNITY_CHARGE =
    new PriorityDebtType('COUNCIL_TAX_COMMUNITY_CHARGE', 'Council Tax or Community Charge')
  static readonly GAS = new PriorityDebtType('GAS', 'Gas')
  static readonly ELECTRICITY = new PriorityDebtType('ELECTRICITY', 'Electricity')
  static readonly WATER = new PriorityDebtType('WATER', 'Water')
  static readonly MAINTENANCE_PAYMENTS =
    new PriorityDebtType('MAINTENANCE_PAYMENTS', 'Maintenance payments')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): PriorityDebtType[] {
    return [
      PriorityDebtType.MORTGAGE,
      PriorityDebtType.RENT,
      PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE,
      PriorityDebtType.GAS,
      PriorityDebtType.ELECTRICITY,
      PriorityDebtType.WATER,
      PriorityDebtType.MAINTENANCE_PAYMENTS
    ]
  }

  static valueOf (value: string): PriorityDebtType {
    return PriorityDebtType.all()
      .filter(type => type.value === value)
      .pop()
  }
}
