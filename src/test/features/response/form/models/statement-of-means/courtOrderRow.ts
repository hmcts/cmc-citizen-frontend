import { expect } from 'chai'

import { Validator } from 'class-validator'
import { CourtOrderRow, ValidationErrors } from 'response/form/models/statement-of-means/courtOrderRow'
import { expectValidationError, generateString } from '../../../../../app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('CourtOrderRow', () => {

  describe('deserialize', () => {

    it('should return empty object for undefined', () => {
      const actual: CourtOrderRow = new CourtOrderRow().deserialize(undefined)

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.details).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: CourtOrderRow = new CourtOrderRow().deserialize({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.details).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {
      const actual: CourtOrderRow = CourtOrderRow.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: CourtOrderRow = CourtOrderRow.fromObject({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.details).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })
  })

  describe('empty', () => {

    it('should return empty instances of CourtOrderRow', () => {

      const actual: CourtOrderRow = CourtOrderRow.empty()

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.details).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })
  })

  describe('isAtLeastOnePopulated', () => {

    context('should return true', () => {

      it('when all populated (valid values)', () => {
        const actual = new CourtOrderRow('offence', 1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when all populated (invalid values)', () => {
        const actual = new CourtOrderRow(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), -1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when details populated', () => {
        const actual = new CourtOrderRow('abc', undefined)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when amount populated', () => {
        const actual = new CourtOrderRow(undefined, 1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when all fields undefined', () => {
        const errors = validator.validateSync(new CourtOrderRow(undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when all are valid', () => {
        const errors = validator.validateSync(new CourtOrderRow('abc', 100))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when invalid amount', () => {
        const errors = validator.validateSync(new CourtOrderRow('abc', 10.111))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('when negative amount', () => {
        const errors = validator.validateSync(new CourtOrderRow('abc', -10))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when amount = 0', () => {
        const errors = validator.validateSync(new CourtOrderRow('abc', 0))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when empty amount', () => {
        const errors = validator.validateSync(new CourtOrderRow('card', undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when empty details', () => {
        const errors = validator.validateSync(new CourtOrderRow('', 10))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DETAILS_REQUIRED)
      })

      it('when too long details', () => {
        const errors = validator.validateSync(
          new CourtOrderRow(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 10)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
      })
    })
  })
})
