import { expect } from 'chai'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { IncomeSource as FormIncomeSource } from 'response/form/models/statement-of-means/incomeSource'
import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'
import { ExpenseSource as FormExpenseSource } from 'response/form/models/statement-of-means/expenseSource'
import { IncomeExpenseSchedule as FormIncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { Income } from 'claims/models/response/statement-of-means/income'
import { Expense } from 'claims/models/response/statement-of-means/expense'
import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'

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

  describe('fromFormIncomeSource', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSource.fromFormIncomeSource(undefined)).to.equal(undefined)
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const monthlyIncome = new FormIncomeSource(MonthlyIncomeType.JOB.displayValue, 100, FormIncomeExpenseSchedule.MONTH)
      expect(IncomeExpenseSource.fromFormIncomeSource(monthlyIncome)).to.deep.equal({
        'amount': 100,
        'schedule': IncomeExpenseSchedule.MONTH
      })
    })
  })

  describe('fromFormExpenseSource', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSource.fromFormExpenseSource(undefined)).to.equal(undefined)
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const monthlyExpense = new FormExpenseSource(MonthlyIncomeType.JOB.displayValue, 100, FormIncomeExpenseSchedule.MONTH)
      expect(IncomeExpenseSource.fromFormExpenseSource(monthlyExpense)).to.deep.equal({
        'amount': 100,
        'schedule': IncomeExpenseSchedule.MONTH
      })
    })
  })

  describe('fromClaimIncome', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSource.fromClaimIncome(undefined)).to.equal(undefined)
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const income = {
        amount: 200,
        frequency: IncomeExpenseSchedule.WEEK.value,
        type: MonthlyExpenseType.COUNCIL_TAX.displayValue
      } as Income
      expect(IncomeExpenseSource.fromClaimIncome(income)).to.deep.equal({
        amount: 200,
        schedule: {
          value: 'WEEK',
          valueInMonths: 4.333333333333333
        }
      })
    })
  })

  describe('fromClaimExpense', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSource.fromClaimExpense(undefined)).to.equal(undefined)
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const expense = {
        amount: 200,
        frequency: IncomeExpenseSchedule.MONTH.value,
        type: MonthlyExpenseType.MORTGAGE.displayValue
      } as Expense
      expect(IncomeExpenseSource.fromClaimExpense(expense)).to.deep.equal({
        amount: 200,
        schedule: {
          value: 'MONTH',
          valueInMonths: 1
        }
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
