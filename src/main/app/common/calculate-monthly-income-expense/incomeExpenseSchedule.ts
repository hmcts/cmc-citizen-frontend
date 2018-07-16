export class IncomeExpenseSchedule {
  static readonly WEEK = new IncomeExpenseSchedule('WEEK', 52 / 12)
  static readonly TWO_WEEKS = new IncomeExpenseSchedule('TWO_WEEKS', 52 / 12 / 2)
  static readonly FOUR_WEEKS = new IncomeExpenseSchedule('FOUR_WEEKS', 52 / 12 / 4)
  static readonly MONTH = new IncomeExpenseSchedule('MONTH', 1)

  constructor (public readonly value: string, public readonly valueInMonths: number) {}

  static all (): IncomeExpenseSchedule[] {
    return [
      IncomeExpenseSchedule.WEEK,
      IncomeExpenseSchedule.TWO_WEEKS,
      IncomeExpenseSchedule.FOUR_WEEKS,
      IncomeExpenseSchedule.MONTH
    ]
  }

  static of (value: string): IncomeExpenseSchedule {
    const result: IncomeExpenseSchedule = IncomeExpenseSchedule.all().filter(item => item.value === value).pop()

    if (result) {
      return result
    }

    throw new Error(`There is no IncomeExpenseSchedule: '${value}'`)
  }
}
