import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { RejectionReason, ValidationErrors } from 'claimant-response/form/models/rejectionReason'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('RejectionReason', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should show validation error when no rejection reason is entered', () => {
      const errors = validator.validateSync(new RejectionReason(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN)
    })

    it('should throw no validation error when rejection reason is entered', () => {
      const errors = validator.validateSync(new RejectionReason('some rejection reason'))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {
    it('should return undefined when undefined provided', () => {
      const model = RejectionReason.fromObject(undefined)

      expect(model).to.be.eq(undefined)
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new RejectionReason().deserialize(undefined)).to.be.eql(new RejectionReason())
    })

    it('should return an instance from given object', () => {
      const actual: RejectionReason = new RejectionReason().deserialize({ text: 'reason' })
      expect(actual).to.be.eql(new RejectionReason('reason'))
    })
  })
})
