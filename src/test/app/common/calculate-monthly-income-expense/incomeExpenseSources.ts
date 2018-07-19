import { expect } from 'chai'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { IncomeExpenseSchedule as FormIncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import {
  FieldNames as MonthlyIncomeFieldNames,
  MonthlyIncome
} from 'response/form/models/statement-of-means/monthlyIncome'
import {
  FieldNames as MonthlyExpenseFieldNames,
  MonthlyExpenses
} from 'response/form/models/statement-of-means/monthlyExpenses'
import { IncomeSource as FormIncomeSource } from 'response/form/models/statement-of-means/incomeSource'
import { ExpenseSource as FormExpenseSource } from 'response/form/models/statement-of-means/expenseSource'

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

    it('should throw invalid array error when an empty object parameter is provided', () => {
      expect(() => IncomeExpenseSources.fromObject({})).to.throw(Error, 'Invalid value: missing array')
    })

    it('should return a new instance initialised with defaults when an empty incomeExpenseSources array is provided', () => {
      expect(IncomeExpenseSources.fromObject({ incomeExpenseSources: [] })).to.deep.equal(new IncomeExpenseSources([]))
    })

    it('should throw invalid array error when incomeExpenseSources provided is not an array', () => {
      expect(() => IncomeExpenseSources.fromObject({ incomeExpenseSources: 'not an array' })).to.throw(Error, 'Invalid value: missing array')
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

  describe('fromMonthlyIncomeFormModel', () => {
    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const monthlyIncome: MonthlyIncome = new MonthlyIncome(
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.SALARY, 100, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.UNIVERSAL_CREDIT, 200, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.JOBSEEKER_ALLOWANCE_INCOME, 300, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION, 400, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.INCOME_SUPPORT, 500, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.WORKING_TAX_CREDIT, 600, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.CHILD_TAX_CREDIT, 700, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.CHILD_BENEFIT, 800, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.COUNCIL_TAX_SUPPORT, 900, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormIncomeSource(MonthlyIncomeFieldNames.PENSION, 100, FormIncomeExpenseSchedule.TWO_WEEKS)
      )

      expect(IncomeExpenseSources.fromMonthlyIncomeFormModel(monthlyIncome)).to.deep.equal(
        new IncomeExpenseSources(
          [
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 300,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 400,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 500,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 600,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 700,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 800,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 900,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            }
          ]
        )
      )
    })
  })

  describe('fromMonthlyExpenseFormModel', () => {
    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const monthlyExpenses: MonthlyExpenses = new MonthlyExpenses(
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.MORTGAGE, 100, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.RENT, 200, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.COUNCIL_TAX, 300, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.GAS, 400, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.ELECTRICITY, 500, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.WATER, 600, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.TRAVEL, 700, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.SCHOOL, 800, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.FOOD_AND_HOUSEKEEPING, 900, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.TV_AND_BROADBAND, 100, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.HIRE_PURCHASE, 100, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.MOBILE_PHONE, 200, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseFieldNames.MAINTENANCE, 300, FormIncomeExpenseSchedule.TWO_WEEKS)
      )

      expect(IncomeExpenseSources.fromMonthlyExpensesFormModel(monthlyExpenses)).to.deep.equal(
        new IncomeExpenseSources(
          [
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 300,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 400,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 500,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 600,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 700,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 800,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 900,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 300,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
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
        expectValidationError(errors, 'incomeExpenseSources must be an array')
      })

      it('should return an error when `incomeExpenseSources` is invalid', () => {
        const invalidIncomeExpenseSource = new IncomeExpenseSource(undefined, IncomeExpenseSchedule.MONTH)
        const errors = validator.validateSync(new IncomeExpenseSources([invalidIncomeExpenseSource]))

        expect(errors.length).to.equal(1)
        expectValidationError(errors,
          GlobalValidationErrors.NUMBER_REQUIRED &&
          GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      describe('when successful', () => {
        it('should return no error when `incomeExpenseSources` is valid', () => {
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

        it('should return no error when `incomeExpenseSources` is an empty array', () => {
          const errors = validator.validateSync(new IncomeExpenseSources([]))
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
