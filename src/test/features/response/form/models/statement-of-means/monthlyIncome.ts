import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/MonthlyIncome'
import { MonthlyIncomeSource } from 'response/form/models/statement-of-means/MonthlyIncomeSource'
import { ValidationErrors as MonthlyIncomeValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncome'
import { ValidationErrors as MonthlyIncomeSourceValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncomeSource'

const SAMPLE_INVALID_MONTHLY_INCOME_SOURCE =
  new MonthlyIncomeSource(
    SourceNames.SALARY,
    -100,
    IncomeExpenseSchedule.MONTH
  )

const SAMPLE_VALID_MONTHLY_INCOME_SOURCE =
  new MonthlyIncomeSource(
    SourceNames.SALARY,
    100,
    IncomeExpenseSchedule.MONTH
  )

const SAMPLE_MONTHLY_INCOME_FROM_OBJECT = {
  hasSalarySource: true,
  salarySource: {
    amount: 100,
    schedule: IncomeExpenseSchedule.MONTH.value
  }
}
const SAMPLE_MONTHLY_INCOME_DESERIALIZE = {
  hasSalarySource: true,
  salarySource: {
    name: SourceNames.SALARY,
    amount: 100,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  }
}

describe('MonthlyIncome', () => {
  describe('fromObject', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(MonthlyIncome.fromObject(undefined)).to.eql(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(MonthlyIncome.fromObject()).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(MonthlyIncome.fromObject({})).to.deep.equal(new MonthlyIncome(undefined, undefined))
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      expect(MonthlyIncome.fromObject(SAMPLE_MONTHLY_INCOME_FROM_OBJECT)).to.deep.equal(
        new MonthlyIncome(
          true,
          SAMPLE_VALID_MONTHLY_INCOME_SOURCE
        )
      )
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new MonthlyIncome().deserialize(undefined)).to.deep.equal(new MonthlyIncome())
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new MonthlyIncome().deserialize(SAMPLE_MONTHLY_INCOME_DESERIALIZE)).to.deep.equal(
        new MonthlyIncome(
          true,
          SAMPLE_VALID_MONTHLY_INCOME_SOURCE
        )
      )
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return an error when all are undefined', () => {
        const test = new MonthlyIncome(undefined)
        const errors = validator.validateSync(test)
        expect(errors.length).to.equal(1)
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_SALARY_REQUIRED(SourceNames.SALARY))
      })

      it('should return an error when `hasSalarySource` is undefined', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(undefined, SAMPLE_VALID_MONTHLY_INCOME_SOURCE)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_SALARY_REQUIRED(SourceNames.SALARY))
      })

      it('should return an error when `salarySource` is invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(true, SAMPLE_INVALID_MONTHLY_INCOME_SOURCE)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.SALARY))
      })
    })

    describe('when successful', () => {
      it('should return no error when `hasSalarySource` is true and `salarySource` is invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(true, SAMPLE_VALID_MONTHLY_INCOME_SOURCE)
        )
        expect(errors.length).to.equal(0)
      })

      it('should return no error when `hasSalarySource` is false even if `salarySource` is invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(false, SAMPLE_INVALID_MONTHLY_INCOME_SOURCE)
        )
        expect(errors.length).to.equal(0)
      })
    })
  })
})
