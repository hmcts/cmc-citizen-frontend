import { expect } from 'chai'
import { calculateTotalAmount, IncomeExpenseSource } from 'common/monthlyIncomeExpense'
import { IncomeExpenseSchedule } from 'common/incomeExpenseSchedule'

describe('IncomeExpenseSource', () => {

  it('should calculate total amount using weekly schedule', () => {

    let income: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.WEEK }
    ]
    expect(calculateTotalAmount(income)).to.equal(433.33)
  })

  it('should calculate total amount using biweekly schedule', () => {

    let income: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.TWO_WEEKS }
    ]
    expect(calculateTotalAmount(income)).to.equal(216.67)
  })

  it('should calculate total amount using four weekly schedule', () => {

    let income: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.FOUR_WEEKS }
    ]
    expect(calculateTotalAmount(income)).to.equal(108.33)
  })

  it('should calculate total amount using monthly schedule', () => {

    let income: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.MONTH }
    ]
    expect(calculateTotalAmount(income)).to.equal(100)
  })

  it('should calculate total amount using multiple amounts and different income schedules', () => {

    let income: IncomeExpenseSource[] = [
      { amount: 100, incomeExpenseSchedule: IncomeExpenseSchedule.WEEK },
      { amount: 200, incomeExpenseSchedule: IncomeExpenseSchedule.TWO_WEEKS },
      { amount: 300, incomeExpenseSchedule: IncomeExpenseSchedule.FOUR_WEEKS },
      { amount: 400, incomeExpenseSchedule: IncomeExpenseSchedule.MONTH }
    ]
    expect(calculateTotalAmount(income)).to.equal(1591.67)
  })
})
