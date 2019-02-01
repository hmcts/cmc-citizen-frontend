/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { Defence, ValidationErrors } from 'response/form/models/defence'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('Defence', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const defence = new Defence()
      expect(defence.text).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new Defence().deserialize(undefined)).to.eql(new Defence())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new Defence().deserialize(null)).to.eql(new Defence())
    })

    it('should return an instance from given object', () => {
      const description = 'I do not owe this money'
      const result = new Defence().deserialize({
        text: description
      })
      expect(result.text).to.be.equals(description)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject defence text with undefined', () => {
      const errors = validator.validateSync(new Defence(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENCE_REQUIRED)
    })

    it('should reject defence text with null type', () => {
      const errors = validator.validateSync(new Defence(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENCE_REQUIRED)
    })

    it('should reject defence text with empty string', () => {
      const errors = validator.validateSync(new Defence(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENCE_REQUIRED)
    })

    it('should reject defence text with white spaces string', () => {
      const errors = validator.validateSync(new Defence('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENCE_REQUIRED)
    })

    it('should reject defence text with more than max allowed characters', () => {
      const text: string = generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
      const errors = validator.validateSync(new Defence(text))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept defence text with max allowed characters', () => {
      const errors = validator.validateSync(new Defence(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid defence text', () => {
      const errors = validator.validateSync(new Defence('i am owed money £300'))

      expect(errors.length).to.equal(0)
    })

  })
})
