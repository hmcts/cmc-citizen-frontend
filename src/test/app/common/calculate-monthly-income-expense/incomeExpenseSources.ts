import { expect } from 'chai'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { IncomeExpenseSchedule as FormIncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'
import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'
import { IncomeSource as FormIncomeSource } from 'response/form/models/statement-of-means/incomeSource'
import { ExpenseSource, ExpenseSource as FormExpenseSource } from 'response/form/models/statement-of-means/expenseSource'
import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'
import { PriorityDebt } from 'response/form/models/statement-of-means/priorityDebt'

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
        undefined, new FormIncomeSource(MonthlyIncomeType.JOB.displayValue, 100, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, 200, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, 300, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormIncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, 400, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeType.INCOME_SUPPORT.displayValue, 500, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, 600, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormIncomeSource(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, 700, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeType.CHILD_BENEFIT.displayValue, 800, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormIncomeSource(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, 900, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormIncomeSource(MonthlyIncomeType.PENSION.displayValue, 100, FormIncomeExpenseSchedule.TWO_WEEKS)
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
        undefined, new FormExpenseSource(MonthlyExpenseType.MORTGAGE.displayValue, 100, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.RENT.displayValue, 200, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.COUNCIL_TAX.displayValue, 300, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseType.GAS.displayValue, 400, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.ELECTRICITY.displayValue, 500, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.WATER.displayValue, 600, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseType.TRAVEL.displayValue, 700, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.SCHOOL_COSTS.displayValue, 800, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, 900, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseType.TV_AND_BROADBAND.displayValue, 100, FormIncomeExpenseSchedule.TWO_WEEKS),
        undefined, new FormExpenseSource(MonthlyExpenseType.HIRE_PURCHASES.displayValue, 100, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.MOBILE_PHONE.displayValue, 200, FormIncomeExpenseSchedule.MONTH),
        undefined, new FormExpenseSource(MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, 300, FormIncomeExpenseSchedule.TWO_WEEKS)
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

  describe('fromPriorityDebtModel', () => {
    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const priorityDebt: PriorityDebt = new PriorityDebt(
        true, new ExpenseSource(PriorityDebtType.MORTGAGE.displayValue, 100, FormIncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.RENT.displayValue, 200, FormIncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, 300, FormIncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.GAS.displayValue, 400, FormIncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.ELECTRICITY.displayValue, 500, FormIncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.WATER.displayValue, 600, FormIncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, 700, FormIncomeExpenseSchedule.WEEK)
      )

      expect(IncomeExpenseSources.fromPriorityDebtModel(priorityDebt)).to.deep.equal(
        new IncomeExpenseSources(
          [
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.WEEK
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.WEEK
            },
            {
              'amount': 300,
              'schedule': IncomeExpenseSchedule.WEEK
            },
            {
              'amount': 400,
              'schedule': IncomeExpenseSchedule.WEEK
            },
            {
              'amount': 500,
              'schedule': IncomeExpenseSchedule.WEEK
            },
            {
              'amount': 600,
              'schedule': IncomeExpenseSchedule.WEEK
            },
            {
              'amount': 700,
              'schedule': IncomeExpenseSchedule.WEEK
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
