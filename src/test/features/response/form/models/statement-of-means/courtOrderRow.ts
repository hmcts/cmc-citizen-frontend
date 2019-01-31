import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { CourtOrderRow } from 'response/form/models/statement-of-means/courtOrderRow'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('CourtOrderRow', () => {

  describe('deserialize', () => {

    it('should return empty object for undefined', () => {
      const actual: CourtOrderRow = new CourtOrderRow().deserialize(undefined)

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.claimNumber).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
      expect(actual.instalmentAmount).to.eq(undefined)
    })

    it('should return populated object', () => {
      const actual: CourtOrderRow = new CourtOrderRow().deserialize({
        debt: 'credit card', totalOwed: 100, monthlyPayments: 10
      })

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.instalmentAmount).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
      expect(actual.claimNumber).to.eq(undefined)
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
      expect(actual.instalmentAmount).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
      expect(actual.claimNumber).to.eq(undefined)
    })
  })

  describe('empty', () => {

    it('should return empty instances of CourtOrderRow', () => {

      const actual: CourtOrderRow = CourtOrderRow.empty()

      expect(actual).instanceof(CourtOrderRow)
      expect(actual.instalmentAmount).to.eq(undefined)
      expect(actual.amount).to.eq(undefined)
      expect(actual.claimNumber).to.eq(undefined)
    })
  })

  describe('isAtLeastOnePopulated', () => {

    context('should return true', () => {

      it('when all populated (valid values)', () => {
        const actual = new CourtOrderRow(1, 1, 'abc')

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })

      it('when amount populated and instalmentAmount', () => {
        const actual = new CourtOrderRow(1, 1, undefined)

        expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true)
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when all fields undefined', () => {
        const errors = validator.validateSync(new CourtOrderRow(undefined, undefined, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when all are valid', () => {
        const errors = validator.validateSync(new CourtOrderRow(100, 100, 'abc'))

        expect(errors.length).to.equal(0)
      })

      it('when amount has minimal value of £1 pound', () => {
        const errors = validator.validateSync(new CourtOrderRow(1.00, 0, 'abc'))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when invalid amount and instalmentAmount', () => {
        const errors = validator.validateSync(new CourtOrderRow(10.111, 10.111, 'abc'))

        expect(errors.length).to.equal(2)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('when negative amount and instalmentAmount', () => {
        const errors = validator.validateSync(new CourtOrderRow(-10, -10, 'abc'))

        expect(errors.length).to.equal(2)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND)
      })

      it('when amount equal £0', () => {
        const errors = validator.validateSync(new CourtOrderRow(0, 0, 'abc'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND)
      })

      it('when amount equal £0.99', () => {
        const errors = validator.validateSync(new CourtOrderRow(0.99, 0, 'abc'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND)
      })

      it('when empty amount and instalmentAmount', () => {
        const errors = validator.validateSync(new CourtOrderRow(undefined, undefined, 'abc'))

        expect(errors.length).to.equal(2)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND)
      })
    })
  })
})
