import { expect } from 'chai'

import { ExpenseSchedule } from 'features/response/form/models/statement-of-means/expenseSchedule'

describe('ExpenseSchedule', () => {

  describe('of', () => {
    ExpenseSchedule.all().forEach(expectedIncomeExpenseSchedule => {
      it(`should return a valid object for '${expectedIncomeExpenseSchedule.value}'`, () => {
        const actualIncomeExpenseSchedule: ExpenseSchedule = ExpenseSchedule.of(expectedIncomeExpenseSchedule.value)

        expect(actualIncomeExpenseSchedule).to.be.instanceof(ExpenseSchedule)
        expect(actualIncomeExpenseSchedule.value).to.equal(expectedIncomeExpenseSchedule.value)
        expect(actualIncomeExpenseSchedule.displayValue).to.equal(expectedIncomeExpenseSchedule.displayValue)
      })
    })

    it('should throw exception for invalid input', () => {
      try {
        ExpenseSchedule.of('unknown')
      } catch (e) {
        expect(e.message).to.equal(`There is no IncomeExpenseSchedule: 'unknown'`)
      }
    })
  })
})
