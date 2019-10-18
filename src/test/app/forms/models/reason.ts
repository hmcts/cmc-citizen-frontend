/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { Reason, ValidationErrors } from 'claim/form/models/reason'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('Reason', () => {

  describe('constructor', () => {

    it('should set the primitive fields to undefined', () => {
      const reason = new Reason()
      expect(reason.reason).to.be.undefined
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new Reason().deserialize(undefined)).to.eql(new Reason())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new Reason().deserialize(null)).to.eql(new Reason())
    })

    it('should return an instance from given object', () => {
      const description = 'I am owed money 300'
      const result = new Reason().deserialize({
        reason: description
      })
      expect(result.reason).to.be.equals(description)
    })
  })

  describe('isCompleted', () => {

    it('should return false for the undefined', () => {
      const reason = new Reason()
      expect(reason.isCompleted()).to.be.false
    })

    it('should return false for the empty string', () => {
      const reason = new Reason('')
      expect(reason.isCompleted()).to.be.false
    })

    it('should return true for the a given reason', () => {
      const reason = new Reason('Some reason')
      expect(reason.isCompleted()).to.be.true
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject claim reason with undefined reason', () => {
      const errors = validator.validateSync(new Reason(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with null type', () => {
      const errors = validator.validateSync(new Reason(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with empty string', () => {
      const errors = validator.validateSync(new Reason(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with white spaces string', () => {
      const errors = validator.validateSync(new Reason('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject claim reason with more than max allowed characters', () => {
      const errors = validator.validateSync(new Reason(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept claim reason with max allowed characters', () => {
      const errors = validator.validateSync(new Reason(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid claim reason', () => {
      const errors = validator.validateSync(new Reason('i am owed money £300'))

      expect(errors.length).to.equal(0)
    })

  })
})
