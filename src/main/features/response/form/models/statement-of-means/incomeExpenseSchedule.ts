export class IncomeExpenseSchedule {
  static readonly WEEK = new IncomeExpenseSchedule('WEEK', 'Week')
  static readonly TWO_WEEKS = new IncomeExpenseSchedule('TWO_WEEKS', '2 weeks')
  static readonly FOUR_WEEKS = new IncomeExpenseSchedule('FOUR_WEEKS', '4 weeks')
  static readonly MONTH = new IncomeExpenseSchedule('MONTH', 'Month')

  constructor (public readonly value: string, public readonly displayValue: string) {}

  static all (): IncomeExpenseSchedule[] {
    return [
      IncomeExpenseSchedule.WEEK,
      IncomeExpenseSchedule.TWO_WEEKS,
      IncomeExpenseSchedule.FOUR_WEEKS,
      IncomeExpenseSchedule.MONTH
    ]
  }

  static of (value: string): IncomeExpenseSchedule {
    return IncomeExpenseSchedule.all()
      .filter(item => item.value === value)
      .pop()
  }
}
