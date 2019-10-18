import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { AmountDescriptionRow, ValidationErrors } from 'response/form/models/statement-of-means/amountDescriptionRow'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('AmountDescriptionRow', () => {

  describe('deserialize', () => {

    it('should return empty object for undefined', () => {
      const actual: AmountDescriptionRow = new AmountDescriptionRow().deserialize(undefined)

      expect(actual).instanceof(AmountDescriptionRow)
      expect(actual.description).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: AmountDescriptionRow = new AmountDescriptionRow().deserialize({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(AmountDescriptionRow)
      expect(actual.description).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {
      const actual: AmountDescriptionRow = AmountDescriptionRow.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: AmountDescriptionRow = AmountDescriptionRow.fromObject({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(AmountDescriptionRow)
      expect(actual.description).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })
  })

  describe('empty', () => {

    it('should return empty instances of AmountDescriptionRow', () => {

      const actual: AmountDescriptionRow = AmountDescriptionRow.empty()

      expect(actual).instanceof(AmountDescriptionRow)
      expect(actual.description).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
    })
  })

  describe('isAtLeastOnePopulated', () => {

    context('should return true', () => {

      it('when all populated (valid values)', () => {
        const actual = new AmountDescriptionRow('offence', 1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when all populated (invalid values)', () => {
        const actual = new AmountDescriptionRow(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), -1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when details populated', () => {
        const actual = new AmountDescriptionRow('abc', undefined)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when amount populated', () => {
        const actual = new AmountDescriptionRow(undefined, 1)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when all fields undefined', () => {
        const errors = validator.validateSync(new AmountDescriptionRow(undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when all are valid', () => {
        const errors = validator.validateSync(new AmountDescriptionRow('abc', 100))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when invalid amount', () => {
        const errors = validator.validateSync(new AmountDescriptionRow('abc', 10.111))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('when negative amount', () => {
        const errors = validator.validateSync(new AmountDescriptionRow('abc', -10))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when amount = 0', () => {
        const errors = validator.validateSync(new AmountDescriptionRow('abc', 0))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when empty amount', () => {
        const errors = validator.validateSync(new AmountDescriptionRow('card', undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      it('when empty details', () => {
        const errors = validator.validateSync(new AmountDescriptionRow('', 10))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
      })

      it('when too long details', () => {
        const errors = validator.validateSync(
          new AmountDescriptionRow(generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 10)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DESCRIPTION_TOO_LONG)
      })
    })
  })
})
