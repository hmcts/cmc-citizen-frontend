import { expect } from 'chai'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { IncomeExpenseSchedule as IncomeExpenseScheduleFormModel } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyIncomeSource } from 'response/form/models/statement-of-means/monthlyIncomeSource'

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
      expect(IncomeExpenseSources.fromObject({})).to.deep.equal(new IncomeExpenseSources(undefined))
    })

    it('should return a new instance initialised with defaults when an empty incomeExpenseSources array is provided', () => {
      expect(IncomeExpenseSources.fromObject({ incomeExpenseSources: [] })).to.deep.equal(new IncomeExpenseSources([]))
    })

    it('should return a new instance initialised with defaults when incomeExpenseSources provided is not an array', () => {
      expect(IncomeExpenseSources.fromObject({ incomeExpenseSources: 'not an array' })).to.deep.equal(new IncomeExpenseSources(undefined))
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

  describe('fromFormModel', () => {

    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSources.fromFormModel(undefined)).to.equal(undefined)
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const monthlyIncome: MonthlyIncome = new MonthlyIncome(
        new MonthlyIncomeSource(SourceNames.SALARY, 100, IncomeExpenseScheduleFormModel.MONTH),
        new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, 200, IncomeExpenseScheduleFormModel.MONTH),
        new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, 300, IncomeExpenseScheduleFormModel.TWO_WEEKS),
        new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, 400, IncomeExpenseScheduleFormModel.MONTH),
        new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, 500, IncomeExpenseScheduleFormModel.MONTH),
        new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, 600, IncomeExpenseScheduleFormModel.TWO_WEEKS),
        new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, 700, IncomeExpenseScheduleFormModel.MONTH),
        new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, 800, IncomeExpenseScheduleFormModel.MONTH),
        new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, 900, IncomeExpenseScheduleFormModel.TWO_WEEKS),
        new MonthlyIncomeSource(SourceNames.PENSION, 100, IncomeExpenseScheduleFormModel.TWO_WEEKS)
      )

      expect(IncomeExpenseSources.fromFormModel(monthlyIncome)).to.deep.equal(
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
