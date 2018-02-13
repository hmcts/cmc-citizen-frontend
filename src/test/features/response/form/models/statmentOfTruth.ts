/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { StatementOfTruth, ValidationErrors } from 'response/form/models/statementOfTruth'

describe('StatementOfTruth', () => {
  describe('constructor', () => {
    it('should set signed to undefined', () => {
      const model = new StatementOfTruth()
      expect(model.signed).to.be.undefined
    })
    it('should set signed to true', () => {
      const model = new StatementOfTruth(true)
      expect(model.signed).to.be.true
    })
    it('should set signed to false', () => {
      const model = new StatementOfTruth(false)
      expect(model.signed).to.be.false
    })
  })

  describe('fromObject', () => {
    it('should return an instance initialised with truthy value', () => {
      expect(StatementOfTruth.fromObject(undefined)).to.eql(new StatementOfTruth())
    })

    it('should return a valid object for "true"', () => {
      expect(StatementOfTruth.fromObject({ signed: 'true' })).to.eql(new StatementOfTruth(true))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject', () => {
      [undefined, null, false].forEach((v) => {
        it(`statement of truth with ${v}`, () => {
          const errors = validator.validateSync(new StatementOfTruth(v))

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE)
        })
      })
    })

    describe('should accept', () => {
      it('statement of truth with true', () => {
        const errors = validator.validateSync(new StatementOfTruth(true))
        expect(errors.length).to.equal(0)
      })
    })
  })
})
