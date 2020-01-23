/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Declaration } from 'offer/form/models/declaration'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('Declaration', () => {
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject unspecified declaration', () => {
      const errors = validator.validateSync(new Declaration())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.DECLARATION_REQUIRED)
    })

    it('should reject unsigned declaration', () => {
      const errors = validator.validateSync(new Declaration(false))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.DECLARATION_REQUIRED)
    })

    it('should accept a signed declaration', () => {
      const errors = validator.validateSync(new Declaration(true))
      expect(errors.length).to.equal(0)
    })
  })
})
