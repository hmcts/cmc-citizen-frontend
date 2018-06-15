import { expect } from 'chai'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { MonthlyIncomeExpense } from 'common/monthlyIncomeExpense';

describe('MonthlyIncomeExpenses', () => {
  it.only('should calculate total amount', () => {
    const salary = 1000
    const incomeExpenseSchedule: IncomeExpenseSchedule = IncomeExpenseSchedule.of(IncomeExpenseSchedule.WEEK.value)

    let monthlyIncomeExpense = new MonthlyIncomeExpense(salary, incomeExpenseSchedule)
    expect(monthlyIncomeExpense.getTotalAmount()).to.equal(1000)

    const incomeBenefit = 500
    monthlyIncomeExpense = new MonthlyIncomeExpense(incomeBenefit, incomeExpenseSchedule)
    expect(monthlyIncomeExpense.getTotalAmount()).to.equal(200)
  })
})
