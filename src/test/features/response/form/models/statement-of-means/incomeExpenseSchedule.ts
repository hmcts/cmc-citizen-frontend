import { expect } from 'chai'

import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'

describe('ExpenseSchedule', () => {

  describe('of', () => {
    IncomeExpenseSchedule.all().forEach(expectedIncomeExpenseSchedule => {
      it(`should return a valid object for '${expectedIncomeExpenseSchedule.value}'`, () => {
        const actualIncomeExpenseSchedule: IncomeExpenseSchedule = IncomeExpenseSchedule.of(expectedIncomeExpenseSchedule.value)

        expect(actualIncomeExpenseSchedule).to.be.instanceof(IncomeExpenseSchedule)
        expect(actualIncomeExpenseSchedule.value).to.equal(expectedIncomeExpenseSchedule.value)
        expect(actualIncomeExpenseSchedule.displayValue).to.equal(expectedIncomeExpenseSchedule.displayValue)
      })
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
