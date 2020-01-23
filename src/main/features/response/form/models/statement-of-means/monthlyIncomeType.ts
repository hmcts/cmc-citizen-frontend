export class MonthlyIncomeType {

  static readonly JOB = new MonthlyIncomeType('JOB', 'income from your job')
  static readonly UNIVERSAL_CREDIT = new MonthlyIncomeType('UNIVERSAL_CREDIT', 'Universal Credit')
  static readonly JOB_SEEKERS_ALLOWANCE_INCOME_BASES = new MonthlyIncomeType('JOB_SEEKERS_ALLOWANCE_INCOME_BASES', 'Jobseeker’s Allowance (income based)')
  static readonly JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED = new MonthlyIncomeType('JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED', 'Jobseeker’s Allowance (contribution based)')
  static readonly INCOME_SUPPORT = new MonthlyIncomeType('INCOME_SUPPORT', 'Income Support')
  static readonly WORKING_TAX_CREDIT = new MonthlyIncomeType('WORKING_TAX_CREDIT', 'Working Tax Credit')
  static readonly CHILD_TAX_CREDIT = new MonthlyIncomeType('CHILD_TAX_CREDIT', 'Child Tax Credit')
  static readonly CHILD_BENEFIT = new MonthlyIncomeType('CHILD_BENEFIT', 'Child Benefit')
  static readonly COUNCIL_TAX_SUPPORT = new MonthlyIncomeType('COUNCIL_TAX_SUPPORT', 'Council Tax Support')
  static readonly PENSION = new MonthlyIncomeType('PENSION', 'pension')
  static readonly OTHER = new MonthlyIncomeType('OTHER', 'other')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): MonthlyIncomeType[] {
    return [
      MonthlyIncomeType.JOB,
      MonthlyIncomeType.UNIVERSAL_CREDIT,
      MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES,
      MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED,
      MonthlyIncomeType.INCOME_SUPPORT,
      MonthlyIncomeType.WORKING_TAX_CREDIT,
      MonthlyIncomeType.CHILD_TAX_CREDIT,
      MonthlyIncomeType.CHILD_BENEFIT,
      MonthlyIncomeType.COUNCIL_TAX_SUPPORT,
      MonthlyIncomeType.PENSION,
      MonthlyIncomeType.OTHER
    ]
  }

  static valueOf (value: string): MonthlyIncomeType {
    return MonthlyIncomeType.all()
      .filter(type => type.value === value)
      .pop()
  }
}
