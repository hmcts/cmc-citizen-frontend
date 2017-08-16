/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { ClaimReference, ValidationErrors } from 'forms/models/claimReference'

describe('ClaimReference', () => {

  describe('constructor', () => {
    it('should have the primitive field set to undefined', () => {
      let claimReference = new ClaimReference()
      expect(claimReference.reference).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a ClaimReference instance initialised with defaults given undefined', () => {
      expect(new ClaimReference().deserialize(undefined)).to.eql(new ClaimReference())
    })

    it('should return a ClaimReference instance initialised with defaults when given null', () => {
      expect(new ClaimReference().deserialize(null)).to.eql(new ClaimReference())
    })

    it('should return a ClaimReference instance with set fields from given object', () => {
      let result = new ClaimReference().deserialize({
        reference: '000MC001'
      })
      expect(result.reference).to.equal('000MC001')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty claim reference', () => {
      const errors = validator.validateSync(new ClaimReference())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CLAIM_REFERENCE_REQUIRED)
    })

    it('should reject less than allowed characters reference', () => {
      const errors = validator.validateSync(new ClaimReference('000MC12'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CLAIM_REFERENCE_INVALID)
    })

    it('should reject more than allowed numbers claim reference', () => {
      const errors = validator.validateSync(new ClaimReference('000MC0011'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CLAIM_REFERENCE_INVALID)
    })

    it('should reject claim reference with wrong alphabets in middle', () => {
      const errors = validator.validateSync(new ClaimReference('000CM001'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CLAIM_REFERENCE_INVALID)
    })

    it('should accepts valid claim reference', () => {
      const errors = validator.validateSync(new ClaimReference('000MC001'))

      expect(errors.length).to.equal(0)
    })
  })
})
