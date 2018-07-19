import { expect } from 'chai'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'

describe('ExpenseSchedule', () => {
  describe('of', () => {
    it('should return valid object for valid input', () => {
      const incomeExpenseSchedule: IncomeExpenseSchedule = IncomeExpenseSchedule.of(IncomeExpenseSchedule.WEEK.value)

      expect(incomeExpenseSchedule instanceof IncomeExpenseSchedule).to.equal(true)
      expect(incomeExpenseSchedule.value).to.equal(IncomeExpenseSchedule.WEEK.value)
      expect(incomeExpenseSchedule.valueInMonths).to.equal(IncomeExpenseSchedule.WEEK.valueInMonths)
    })

    it('should throw exception for invalid input', () => {
      try {
        IncomeExpenseSchedule.of('unknown')
      } catch (e) {
        expect(e.message).to.equal(`There is no IncomeExpenseSchedule: 'unknown'`)
      }
    })
  })
})
