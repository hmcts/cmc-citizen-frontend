import { expect } from 'chai'
import { CalculateMonthlyIncomeExpense } from 'common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'

describe('CalculateMonthlyIncomeExpense', () => {

  it('should calculate total amount using weekly schedule', () => {

    const incomeExpenseSource = [ { 'amount': 100, 'schedule': IncomeExpenseSchedule.WEEK } ]
    expect(CalculateMonthlyIncomeExpense
      .calculateTotalAmount(incomeExpenseSource))
      .to.equal(433.33)
  })

  it('should calculate total amount using biweekly schedule', () => {

    const incomeExpenseSource = [ { 'amount': 100, 'schedule': IncomeExpenseSchedule.TWO_WEEKS } ]
    expect(CalculateMonthlyIncomeExpense
      .calculateTotalAmount(incomeExpenseSource))
      .to.equal(216.67)
  })

  it('should calculate total amount using four weekly schedule', () => {

    const incomeExpenseSource = [ { 'amount': 100, 'schedule': IncomeExpenseSchedule.FOUR_WEEKS } ]
    expect(CalculateMonthlyIncomeExpense
      .calculateTotalAmount(incomeExpenseSource))
      .to.equal(108.33)
  })

  it('should calculate total amount using monthly schedule', () => {

    const incomeExpenseSource = [ { 'amount': 100, 'schedule': IncomeExpenseSchedule.MONTH } ]
    expect(CalculateMonthlyIncomeExpense
      .calculateTotalAmount(incomeExpenseSource))
      .to.equal(100)
  })

  it('should calculate total amount using multiple amounts and different income or expense schedules', () => {

    const incomeExpenseSource = [
      { 'amount': 100, 'schedule': IncomeExpenseSchedule.WEEK },
      { 'amount': 100, 'schedule': IncomeExpenseSchedule.TWO_WEEKS },
      { 'amount': 100, 'schedule': IncomeExpenseSchedule.FOUR_WEEKS },
      { 'amount': 100, 'schedule': IncomeExpenseSchedule.MONTH }
    ]

    expect(CalculateMonthlyIncomeExpense
      .calculateTotalAmount(incomeExpenseSource)).to.equal(858.33)
  })
})
