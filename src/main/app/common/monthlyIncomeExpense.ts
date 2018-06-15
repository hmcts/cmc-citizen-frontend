import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'

export class MonthlyIncomeExpense {
  amount: number
  frequency: IncomeExpenseSchedule
  totalAmount: number = 0

  getTotalAmount (amount: number): number {
    return this.amount += amount
  }

  convertIncomeExpenseSchedule (incomeExpenseSchedule: IncomeExpenseSchedule): number {
    switch (incomeExpenseSchedule) {
      case IncomeExpenseSchedule.WEEK:
        return 52 / 12
      case IncomeExpenseSchedule.TWO_WEEKS:
        return 52 / 12 / 2
      case IncomeExpenseSchedule.FOUR_WEEKS:
        return 52 / 12 / 4
      case IncomeExpenseSchedule.MONTH:
        return 1
      default:
        throw new Error('Unknown income schedule')
    }
  }

  getTotalAmountPerMonth ()
}
