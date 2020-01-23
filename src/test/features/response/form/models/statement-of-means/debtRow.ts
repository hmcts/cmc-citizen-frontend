import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { DebtRow, ValidationErrors } from 'response/form/models/statement-of-means/debtRow'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('DebtRow', () => {

  describe('deserialize', () => {

    it('should return empty object for undefined', () => {
      const actual: DebtRow = new DebtRow().deserialize(undefined)

      expect(actual).instanceof(DebtRow)
      expect(actual.debt).to.eq(undefined)
      expect(actual.totalOwed).to.eq(undefined)
      expect(actual.monthlyPayments).to.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: DebtRow = new DebtRow().deserialize({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(DebtRow)
      expect(actual.debt).to.eq('credit card')
      expect(actual.totalOwed).to.eq(100)
      expect(actual.monthlyPayments).to.eq(10)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {
      const actual: DebtRow = DebtRow.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: DebtRow = DebtRow.fromObject({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(DebtRow)
      expect(actual.debt).to.eq('credit card')
      expect(actual.totalOwed).to.eq(100)
      expect(actual.monthlyPayments).to.eq(10)
    })
  })

  describe('empty', () => {

    it('should return empty instances of DebtRow', () => {

      const actual: DebtRow = DebtRow.empty()

      expect(actual).instanceof(DebtRow)
      expect(actual.debt).to.eq(undefined)
      expect(actual.totalOwed).to.eq(undefined)
      expect(actual.monthlyPayments).to.eq(undefined)
    })
  })

  describe('isAtLeastOnePopulated', () => {

    context('should return true', () => {

      it('when all populated (valid values)', () => {
        const actual = new DebtRow('credit', 1, 1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when all populated (invalid values)', () => {
        const actual = new DebtRow(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), -1, 1.111)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when description populated', () => {
        const actual = new DebtRow('credit', undefined, undefined)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when description populated', () => {
        const actual = new DebtRow(undefined, 1, undefined)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when totalOwed populated', () => {
        const actual = new DebtRow(undefined, 1, undefined)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when monthlyPayments populated', () => {
        const actual = new DebtRow(undefined, undefined, 1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when all fields undefined', () => {
        const errors = validator.validateSync(new DebtRow(undefined, undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when all are valid', () => {
        const errors = validator.validateSync(new DebtRow('credit card', 100, 10))

        expect(errors.length).to.equal(0)
      })

      it('when total owed has minimal value of 1 penny', () => {
        const errors = validator.validateSync(new DebtRow('credit card', 0.01, 0))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when invalid totalOwed', () => {
        const errors = validator.validateSync(new DebtRow('credit card', 10.111, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('when invalid monthlyPayments', () => {
        const errors = validator.validateSync(new DebtRow('credit card', 100, 10.111))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('when negative totalOwed', () => {
        const errors = validator.validateSync(new DebtRow('credit card', -10, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when negative monthlyPayments', () => {
        const errors = validator.validateSync(new DebtRow('credit card', -10, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when total owed equal zero', () => {
        const errors = validator.validateSync(new DebtRow('card', 0, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when empty total owed', () => {
        const errors = validator.validateSync(new DebtRow('card', undefined, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.TOTAL_OWED_REQUIRED)
      })

      it('when empty monthly payments', () => {
        const errors = validator.validateSync(new DebtRow('card', 1, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.MONTHLY_PAYMENT_REQUIRED)
      })

      it('when empty description', () => {
        const errors = validator.validateSync(new DebtRow('', 10, 1))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DEBT_REQUIRED)
      })

      it('when too long description', () => {
        const errors = validator.validateSync(
          new DebtRow(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 10, 1)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
      })
    })
  })
})
