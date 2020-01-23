import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { PaidAmount, ValidationErrors } from 'ccj/form/models/paidAmount'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'

describe('PaidAmount', () => {
  describe('deserialize', () => {
    it('should not populate fields when object not given', () => {
      const paidAmount: PaidAmount = new PaidAmount().deserialize({})

      expect(paidAmount.amount).to.equal(undefined)
      expect(paidAmount.option).to.equal(undefined)
    })

    it('should populate only option for "NO"', () => {
      const paidAmount: PaidAmount = new PaidAmount().deserialize({ option: PaidAmountOption.NO })

      expect(paidAmount.amount).to.equal(undefined)
      expect(paidAmount.option).to.equal(PaidAmountOption.NO)
    })

    it('should populate all fields', () => {
      const paidAmount: PaidAmount = new PaidAmount().deserialize({ option: PaidAmountOption.YES, amount: 10 })

      expect(paidAmount.amount).to.equal(10)
      expect(paidAmount.option).to.equal(PaidAmountOption.YES)
    })
  })

  describe('fromObject', () => {
    it('empty object should return unpopulated PaidAmount', () => {
      const paidAmount: PaidAmount = PaidAmount.fromObject({})

      expect(paidAmount.amount).to.equal(undefined)
      expect(paidAmount.option).to.equal(undefined)
    })

    it('should not populate amount for option NO', () => {
      const paidAmount: PaidAmount = PaidAmount.fromObject({ option: PaidAmountOption.NO.value })

      expect(paidAmount.amount).to.equal(undefined)
      expect(paidAmount.option).to.equal(PaidAmountOption.NO)
    })

    it('should populate amount for option YES', () => {
      const paidAmount: PaidAmount = PaidAmount.fromObject({ option: PaidAmountOption.YES.value, amount: 10 })

      expect(paidAmount.amount).to.equal(10)
      expect(paidAmount.option).to.equal(PaidAmountOption.YES)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new PaidAmount(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })

      it('invalid option', () => {
        const errors = validator.validateSync(new PaidAmount(new PaidAmountOption('maybe')))

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
      it('valid option, but invalid amount (invalid decimals)', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 10.523))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('valid option, but invalid amount (zero)', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 0))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

      it('valid option, valid amount, but greater that total amount', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 100, 10))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.PAID_AMOUNT_GREATER_THAN_TOTAL_AMOUNT)
      })

      it('valid option, valid amount, but equal total amount', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 100, 100))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.PAID_AMOUNT_GREATER_THAN_TOTAL_AMOUNT)
      })
    })

    describe('should accept when', () => {
      it('option is NO', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.NO))

        expect(errors.length).to.equal(0)
      })

      it('option is YES and amount is valid', () => {
        const errors = validator.validateSync(new PaidAmount(PaidAmountOption.YES, 100, 1000))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
