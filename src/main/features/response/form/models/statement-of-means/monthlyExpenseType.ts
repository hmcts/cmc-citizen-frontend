export class MonthlyExpenseType {

  static readonly MORTGAGE = new MonthlyExpenseType('MORTGAGE', 'mortgage')
  static readonly RENT = new MonthlyExpenseType('RENT', 'rent')
  static readonly COUNCIL_TAX = new MonthlyExpenseType('COUNCIL_TAX', 'Council Tax')
  static readonly GAS = new MonthlyExpenseType('GAS', 'gas')
  static readonly ELECTRICITY = new MonthlyExpenseType('ELECTRICITY', 'electricity')
  static readonly WATER = new MonthlyExpenseType('WATER', 'water')
  static readonly TRAVEL = new MonthlyExpenseType('TRAVEL', 'travel (work or school)')
  static readonly SCHOOL_COSTS = new MonthlyExpenseType('SCHOOL_COSTS', 'school costs (include clothing)')
  static readonly FOOD_HOUSEKEEPING = new MonthlyExpenseType('FOOD_HOUSEKEEPING', 'food and housekeeping')
  static readonly TV_AND_BROADBAND = new MonthlyExpenseType('TV_AND_BROADBAND', 'TV and broadband')
  static readonly HIRE_PURCHASES = new MonthlyExpenseType('HIRE_PURCHASES', 'hire purchase')
  static readonly MOBILE_PHONE = new MonthlyExpenseType('MOBILE_PHONE', 'mobile phone')
  static readonly MAINTENANCE_PAYMENTS = new MonthlyExpenseType('MAINTENANCE_PAYMENTS', 'maintenance payments')
  static readonly OTHER = new MonthlyExpenseType('OTHER', 'other expense')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): MonthlyExpenseType[] {
    return [
      MonthlyExpenseType.MORTGAGE,
      MonthlyExpenseType.RENT,
      MonthlyExpenseType.COUNCIL_TAX,
      MonthlyExpenseType.GAS,
      MonthlyExpenseType.ELECTRICITY,
      MonthlyExpenseType.WATER,
      MonthlyExpenseType.TRAVEL,
      MonthlyExpenseType.SCHOOL_COSTS,
      MonthlyExpenseType.FOOD_HOUSEKEEPING,
      MonthlyExpenseType.TV_AND_BROADBAND,
      MonthlyExpenseType.HIRE_PURCHASES,
      MonthlyExpenseType.MOBILE_PHONE,
      MonthlyExpenseType.MAINTENANCE_PAYMENTS,
      MonthlyExpenseType.OTHER
    ]
  }

  static valueOf (value: string): MonthlyExpenseType {
    return MonthlyExpenseType.all()
      .filter(type => type.value === value)
      .pop()
  }
}
