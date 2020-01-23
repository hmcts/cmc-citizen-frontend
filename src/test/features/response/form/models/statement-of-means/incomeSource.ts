import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeSource, ValidationErrors } from 'response/form/models/statement-of-means/incomeSource'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'

const SAMPLE_MONTHLY_INCOME_SOURCE_FROM_OBJECT = {
  amount: 100,
  schedule: IncomeExpenseSchedule.MONTH.value
}
const SAMPLE_MONTHLY_INCOME_SOURCE_DESERIALIZE = {
  name: 'name',
  amount: 100,
  schedule: {
    value: IncomeExpenseSchedule.MONTH.value,
    displayValue: IncomeExpenseSchedule.MONTH.displayValue
  }
}

describe('IncomeSource', () => {
  describe('fromObject', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeSource.fromObject('name', undefined)).to.eql(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(IncomeSource.fromObject('name')).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(IncomeSource.fromObject('name', {})).to.deep.equal(new IncomeSource('name'))
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      expect(IncomeSource.fromObject('name', SAMPLE_MONTHLY_INCOME_SOURCE_FROM_OBJECT)).to.deep.equal(
        new IncomeSource(
          'name',
          100,
          IncomeExpenseSchedule.MONTH
        )
      )
    })

    it('should return a new instance initialised with name set to undefined', () => {
      expect(IncomeSource.fromObject(undefined)).to.eql(undefined, undefined)
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new IncomeSource('name').deserialize(undefined)).to.deep.equal(new IncomeSource('name'))
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new IncomeSource('name').deserialize(SAMPLE_MONTHLY_INCOME_SOURCE_DESERIALIZE)).to.deep.equal(
        new IncomeSource(
          'name',
          100,
          IncomeExpenseSchedule.MONTH
        )
      )
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return errors when all expect `name` are undefined', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', undefined))
        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED('Source name'))
        expectValidationError(errors, ValidationErrors.SCHEDULE_SELECT_AN_OPTION('Source name'))
      })

      it('should return an error when `amount` is undefined', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', undefined, IncomeExpenseSchedule.MONTH))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED('Source name'))
      })

      it('should return an error when `amount` has invalid decimal amount', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', 0.123, IncomeExpenseSchedule.MONTH))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS('Source name'))
      })

      it('should return an error when `amount` is negative', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', -100, IncomeExpenseSchedule.MONTH))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED('Source name'))
      })

      it('should return an error when `schedule` is undefined', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', 100, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.SCHEDULE_SELECT_AN_OPTION('Source name'))
      })

      it('should return an error when `schedule` is invalid', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', 100, new IncomeExpenseSchedule('UNKNOWN', 'Unknown')))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.SCHEDULE_SELECT_AN_OPTION('Source name'))
      })
    })

    describe('when successful', () => {
      it('should return no error', () => {
        const errors = validator.validateSync(new IncomeSource('Source name', 100, IncomeExpenseSchedule.MONTH))
        expect(errors.length).to.equal(0)
      })
    })
  })
})
