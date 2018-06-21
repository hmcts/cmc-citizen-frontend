import { expect } from 'chai'
import { IncomeExpenseSources } from 'common/incomeExpenseSources'
import { IncomeExpenseSchedule } from 'common/incomeExpenseSchedule'
import { Validator } from 'class-validator'
import { expectValidationError } from '../forms/models/validationUtils'

const SAMPLE_INCOME_EXPENSE_SOURCES_FROM_OBJECT = {
  incomeExpenseSources: [
    {
      'amount': 100,
      'schedule': IncomeExpenseSchedule.MONTH.value
    }
  ]
}

describe('IncomeExpenseSources', () => {
  describe('fromObject', () => {

    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSources.fromObject(undefined)).to.eql(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(IncomeExpenseSources.fromObject()).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(IncomeExpenseSources.fromObject({})).to.deep.equal(new IncomeExpenseSources([]))
    })

    it('should return a new instance initialised with defaults when an empty incomeExpenseSources array is provided', () => {
      expect(IncomeExpenseSources.fromObject({ incomeExpenseSources: [] })).to.deep.equal(new IncomeExpenseSources([]))
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      expect(IncomeExpenseSources.fromObject(SAMPLE_INCOME_EXPENSE_SOURCES_FROM_OBJECT)).to.deep.equal(
        new IncomeExpenseSources(
          [
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            }
          ]
        )
      )
    })

  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {

      it('should return an error when `incomeExpenseSources` is undefined', () => {
        const errors = validator.validateSync(new IncomeExpenseSources(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors,'ARRAY_REQUIRED')
      })

      it('should return an error when `incomeExpenseSources` is empty array', () => {
        const errors = validator.validateSync(new IncomeExpenseSources([]))

        expect(errors.length).to.equal(1)
        expectValidationError(errors,'INVALID_ARRAY_MIN_SIZE')
      })

      describe('when successful', () => {
        it('should return no error', () => {
          const errors = validator.validateSync(new IncomeExpenseSources([
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.WEEK
            }
          ]))
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
