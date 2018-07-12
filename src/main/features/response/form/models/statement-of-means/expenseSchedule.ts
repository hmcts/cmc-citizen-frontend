export class ExpenseSchedule {
  static readonly WEEK = new ExpenseSchedule('WEEK', 'Week')
  static readonly TWO_WEEKS = new ExpenseSchedule('TWO_WEEKS', '2 weeks')
  static readonly FOUR_WEEKS = new ExpenseSchedule('FOUR_WEEKS', '4 weeks')
  static readonly MONTH = new ExpenseSchedule('MONTH', 'Month')

  constructor (public readonly value: string, public readonly displayValue: string) {}

  static all (): ExpenseSchedule[] {
    return [
      ExpenseSchedule.WEEK,
      ExpenseSchedule.TWO_WEEKS,
      ExpenseSchedule.FOUR_WEEKS,
      ExpenseSchedule.MONTH
    ]
  }

  static of (value: string): ExpenseSchedule {
    return ExpenseSchedule.all()
      .filter(item => item.value === value)
      .pop()
  }
}
