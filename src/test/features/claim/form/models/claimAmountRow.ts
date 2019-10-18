import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'

import { ClaimAmountRow, ValidationErrors } from 'claim/form/models/claimAmountRow'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('ClaimAmountRow', () => {

  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(ClaimAmountRow.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(ClaimAmountRow.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(ClaimAmountRow.fromObject({})).to.deep.equal(new ClaimAmountRow())
    })

    it('should deserialize all fields', () => {
      expect(ClaimAmountRow.fromObject({
        reason: 'Something',
        amount: '100.01'
      })).to.deep.equal(new ClaimAmountRow('Something', 100.01))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('should reject when', () => {
      it('row with reason, no amount', () => {
        const errors = validator.validateSync(new ClaimAmountRow('Something', undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
      })

      it('row with amount, no reason', () => {
        const errors = validator.validateSync(new ClaimAmountRow(undefined, 100.00))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
      })

      it('row with zero amount', () => {
        const errors = validator.validateSync(new ClaimAmountRow('Something', 0))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

      it('row with amount lesser then 0.01', () => {
        const errors = validator.validateSync(new ClaimAmountRow('Something', 0.009))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

      it('row with negative amount', () => {
        const errors = validator.validateSync(new ClaimAmountRow('Something', -0.01))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

      it('row with more than two decimal places in amount', () => {
        const errors = validator.validateSync(new ClaimAmountRow('Something', 10.123))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('row with valid amount and too long reason', () => {
        const errors = validator.validateSync(
          new ClaimAmountRow(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1), 1.01)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.REASON_TOO_LONG)
      })

      it('row with amount having invalid comma', () => {
        const errors = validator.validateSync(
          ClaimAmountRow.fromObject(
            {
              reason: 'Something',
              amount: '11,10'
            })
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

    })

    context('should accept', () => {
      it('row with both reason and valid amount', () => {
        const errors = validator.validateSync(new ClaimAmountRow('Something', 0.01))

        expect(errors.length).to.equal(0)
      })

      it('row with amount containing comma', () => {
        const errors = validator.validateSync({ reason: 'Something', amount: '1,100' })

        expect(errors.length).to.equal(0)
      })

      it('row with amount having valid comma', () => {
        const errors = validator.validateSync(
          ClaimAmountRow.fromObject(
            {
              reason: 'Something',
              amount: '1,100'
            })
        )

        expect(errors.length).to.equal(0)
      })

      it('empty row', () => {
        const errors = validator.validateSync(ClaimAmountRow.empty())

        expect(errors.length).to.equal(0)
      })
    })
  })
})
