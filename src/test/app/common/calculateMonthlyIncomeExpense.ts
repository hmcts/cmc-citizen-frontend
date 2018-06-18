import { expect } from 'chai'
import { calculateTotalAmount, IncomeExpenseSource } from 'common/calculateMonthlyIncomeExpense'
import { IncomeExpenseSchedule } from 'common/incomeExpenseSchedule'

describe('IncomeExpenseSource', () => {

  it('should calculate total amount using weekly schedule', () => {

    const incomeOrExpense: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.WEEK }
    ]
    expect(calculateTotalAmount(incomeOrExpense)).to.equal(433.33)
  })

  it('should calculate total amount using biweekly schedule', () => {

    const incomeOrExpense: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.TWO_WEEKS }
    ]
    expect(calculateTotalAmount(incomeOrExpense)).to.equal(216.67)
  })

  it('should calculate total amount using four weekly schedule', () => {

    const incomeOrExpense: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.FOUR_WEEKS }
    ]
    expect(calculateTotalAmount(incomeOrExpense)).to.equal(108.33)
  })

  it('should calculate total amount using monthly schedule', () => {

    const incomeOrExpense: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.MONTH }
    ]
    expect(calculateTotalAmount(incomeOrExpense)).to.equal(100)
  })

  it('should calculate total amount using multiple amounts and different income or expense schedules', () => {

    const incomesOrExpenses: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.WEEK },
      { amount: 200, incomeExpenseSchedule: IncomeExpenseSchedule.TWO_WEEKS },
      { amount: 300, incomeExpenseSchedule: IncomeExpenseSchedule.FOUR_WEEKS },
      { amount: 400, incomeExpenseSchedule: IncomeExpenseSchedule.MONTH }
    ]
    expect(calculateTotalAmount(incomesOrExpenses)).to.equal(1591.67)
  })
})
