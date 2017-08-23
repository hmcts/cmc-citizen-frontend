import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { PaidAmount, PaidAmountOption, ValidationErrors } from 'ccj/form/models/paidAmount'

describe('PaidAmount', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new PaidAmount(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })

      it('invalid option', () => {
        const errors = validator.validateSync(new PaidAmount('maybe'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })

      it('valid option, but undefined amount', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
      })

      it('valid option, but invalid amount (negative)', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, -10))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

      it('valid option, but invalid amount (zero)', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 0))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })
    })

    describe('should accept when', () => {
      it('option is NO', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.NO))

        expect(errors.length).to.equal(0)
      })

      it('option is YES and amount is valid', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 100))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
