/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { StatementOfTruth, ValidationErrors } from 'forms/models/statementOfTruth'

describe('StatementOfTruth', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const statementOfTruth = new StatementOfTruth()
      expect(statementOfTruth.signed).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject claim statement of truth with null type', () => {
      const errors = validator.validateSync(new StatementOfTruth(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE)
    })

    it('should reject claim statement of truth with empty string', () => {
      const errors = validator.validateSync(new StatementOfTruth())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE)
    })

    it('should reject claim statement of truth without accepting the facts stated in the claim', () => {
      const errors = validator.validateSync(new StatementOfTruth(undefined))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE)
    })

    it('should accept claim statement of truth accepting the facts stated in the claim', () => {
      const errors = validator.validateSync(new StatementOfTruth(true))
      expect(errors.length).to.equal(0)
    })

  })
})
