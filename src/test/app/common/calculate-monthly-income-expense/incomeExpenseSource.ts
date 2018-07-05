import { expect } from 'chai'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MonthlyIncomeSource } from 'response/form/models/statement-of-means/monthlyIncomeSource'
import { SourceNames } from 'response/form/models/statement-of-means/monthlyIncome'
import { ExpenseSchedule } from 'response/form/models/statement-of-means/expenseSchedule'

const SAMPLE_INCOME_EXPENSE_SOURCE_FROM_OBJECT = {
  amount: 100,
  schedule: IncomeExpenseSchedule.MONTH.value
}

describe('IncomeExpenseSource', () => {
  describe('fromObject', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSource.fromObject(undefined)).to.deep.equal(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(IncomeExpenseSource.fromObject()).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(IncomeExpenseSource.fromObject({})).to.deep.equal(new IncomeExpenseSource(
        undefined,
        undefined
      ))
    })

    it('should return a new instance with defaults when amount and schedule are invalid', () => {
      expect(IncomeExpenseSource.fromObject({
        'amount': 'INVALID',
        'schedule': 'UNKNOWN'
      })).to.deep.equal(new IncomeExpenseSource(
        undefined,
        undefined
      ))
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      expect(IncomeExpenseSource.fromObject(SAMPLE_INCOME_EXPENSE_SOURCE_FROM_OBJECT)).to.deep.equal(
        new IncomeExpenseSource(
          100,
          IncomeExpenseSchedule.MONTH
        )
      )
    })
  })

  describe('fromFormModel', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSource.fromFormModel(undefined)).to.equal(undefined)
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const montlyIncomeSource = new MonthlyIncomeSource(SourceNames.SALARY, 100, ExpenseSchedule.MONTH)
      expect(IncomeExpenseSource.fromFormModel(montlyIncomeSource)).to.deep.equal({
        'amount': 100,
        'schedule': IncomeExpenseSchedule.MONTH
      })
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {

      it('should return an error when `amount` is undefined', () => {
        const errors = validator.validateSync(new IncomeExpenseSource(undefined, IncomeExpenseSchedule.MONTH))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.NUMBER_REQUIRED)
      })

      it('should return an error when `amount` has invalid decimal amount', () => {
        const errors = validator.validateSync(new IncomeExpenseSource(0.123, IncomeExpenseSchedule.MONTH))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('should return an error when `amount` is negative', () => {
        const errors = validator.validateSync(new IncomeExpenseSource(-100, IncomeExpenseSchedule.MONTH))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('should return an error when `schedule` is undefined', () => {
        const errors = validator.validateSync(new IncomeExpenseSource(100, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.SELECT_AN_OPTION)
      })

      it('should return an error when `schedule` is invalid', () => {
        const errors = validator.validateSync(new IncomeExpenseSource(100, new IncomeExpenseSchedule('UNKNOWN', 1)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.SELECT_AN_OPTION)
      })

      describe('when successful', () => {
        it('should return no error', () => {
          const errors = validator.validateSync(new IncomeExpenseSource(100, IncomeExpenseSchedule.MONTH))
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
