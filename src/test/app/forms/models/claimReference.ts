/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

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

    it('should accepts valid CMC claim reference', () => {
      const errors = validator.validateSync(new ClaimReference('000MC001'))

      expect(errors.length).to.equal(0)
    })

    it('should accept valid CMC claim reference ignoring case', () => {
      const errors = validator.validateSync(new ClaimReference('000MC001'))

      expect(errors.length).to.equal(0)
    })

    it('should accept CCBC claim reference', () => {
      const errors = validator.validateSync(new ClaimReference('A1LL3CC5'))

      expect(errors.length).to.equal(0)
    })
  })
})
