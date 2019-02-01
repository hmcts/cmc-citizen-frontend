/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Declaration, ValidationErrors } from 'ccj/form/models/declaration'

describe('Declaration', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const declaration = new Declaration()
      expect(declaration.signed).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject declaration with null type', () => {
      const errors = validator.validateSync(new Declaration(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DECLARATION_REQUIRED)
    })

    it('should reject declaration with empty string', () => {
      const errors = validator.validateSync(new Declaration())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DECLARATION_REQUIRED)
    })

    it('should reject declaration without accepting the facts stated in the claim', () => {
      const errors = validator.validateSync(new Declaration(undefined))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DECLARATION_REQUIRED)
    })

    it('should accept declaration accepting the facts stated in the claim', () => {
      const errors = validator.validateSync(new Declaration(true))
      expect(errors.length).to.equal(0)
    })
  })
})
