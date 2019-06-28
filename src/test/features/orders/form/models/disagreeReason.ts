/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { DisagreeReason, ValidationErrors } from 'orders/form/models/disagreeReason'

describe('DisagreeReason', () => {

  describe('constructor', () => {

    it('should set the primitive fields to undefined', () => {
      const reason = new DisagreeReason()
      expect(reason.reason).to.be.undefined
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new DisagreeReason().deserialize(undefined)).to.eql(new DisagreeReason())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new DisagreeReason().deserialize(null)).to.eql(new DisagreeReason())
    })

    it('should return an instance from given object', () => {
      const description = 'I want a judge to review the order'
      const result = new DisagreeReason().deserialize({
        reason: description
      })
      expect(result.reason).to.be.equals(description)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject claim reason with undefined reason', () => {
      const errors = validator.validateSync(new DisagreeReason(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with null type', () => {
      const errors = validator.validateSync(new DisagreeReason(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with empty string', () => {
      const errors = validator.validateSync(new DisagreeReason(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with white spaces string', () => {
      const errors = validator.validateSync(new DisagreeReason('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with more than max allowed characters', () => {
      const errors = validator.validateSync(new DisagreeReason(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept claim reason with max allowed characters', () => {
      const errors = validator.validateSync(new DisagreeReason(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid claim reason', () => {
      const errors = validator.validateSync(new DisagreeReason('i am owed money £300'))

      expect(errors.length).to.equal(0)
    })

  })
})
