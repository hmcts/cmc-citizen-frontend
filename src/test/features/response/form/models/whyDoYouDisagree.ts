/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { WhyDoYouDisagree, ValidationErrors } from 'response/form/models/whyDoYouDisagree'

describe('WhyDoYouDisagree', () => {

  describe('constructor', () => {

    it('should set the primitive fields to undefined', () => {
      const model = new WhyDoYouDisagree()
      expect(model.text).to.be.undefined
    })
  })

  describe('deserialize', () => {

    it('should return an instance initialised with defaults for undefined', () => {
      expect(new WhyDoYouDisagree().deserialize(undefined)).to.eql(new WhyDoYouDisagree())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new WhyDoYouDisagree().deserialize(null)).to.eql(new WhyDoYouDisagree())
    })

    it('should return an instance from given object', () => {
      const description = 'I do not owe this money'
      const result = new WhyDoYouDisagree().deserialize({
        text: description
      })
      expect(result.text).to.be.equals(description)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject WhyDoYouDisagree text with undefined', () => {
      const errors = validator.validateSync(new WhyDoYouDisagree(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject WhyDoYouDisagree text with null type', () => {
      const errors = validator.validateSync(new WhyDoYouDisagree(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject WhyDoYouDisagree text with empty string', () => {
      const errors = validator.validateSync(new WhyDoYouDisagree(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject WhyDoYouDisagree text with white spaces string', () => {
      const errors = validator.validateSync(new WhyDoYouDisagree('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject WhyDoYouDisagree text with more than max allowed characters', () => {
      const text: string = generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
      const errors = validator.validateSync(new WhyDoYouDisagree(text))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept WhyDoYouDisagree text with max allowed characters', () => {
      const errors = validator.validateSync(new WhyDoYouDisagree(generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid WhyDoYouDisagree text', () => {
      const errors = validator.validateSync(new WhyDoYouDisagree('i am owed money £300'))

      expect(errors.length).to.equal(0)
    })
  })
})
