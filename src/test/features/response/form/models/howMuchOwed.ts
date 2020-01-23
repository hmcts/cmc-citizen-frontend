/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { HowMuchOwed } from 'features/response/form/models/howMuchOwed'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('HowMuchOwed', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const howMuchOwed = new HowMuchOwed()
      expect(howMuchOwed.amount).to.be.undefined
      expect(howMuchOwed.text).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new HowMuchOwed().deserialize(undefined)).to.eql(new HowMuchOwed())
    })

    it('should return an instance from given object', () => {
      const description: string = 'I do not owe full amount'
      const amount: number = 300
      const result: HowMuchOwed = new HowMuchOwed().deserialize({
        amount: amount,
        text: description
      })
      expect(result.amount).to.be.equal(amount)
      expect(result.text).to.be.equal(description)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject how much owed text with undefined', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, undefined))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with text not defined', () => {
      const errors = validator.validateSync(new HowMuchOwed(300))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with empty string', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, ''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with white spaces string', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, '    '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject when amount not specified', () => {
      const errors = validator.validateSync(new HowMuchOwed(undefined, 'i don’t full the amount of £300'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject when negative amount specified', () => {
      const errors = validator.validateSync(new HowMuchOwed(-300, 'i don’t owe full amount of £300'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with more than max allowed characters', () => {
      const text = randomstring.generate({
        length: ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1,
        charset: 'alphabetic'
      })
      const errors = validator.validateSync(new HowMuchOwed(300, text))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept how much owed text with max allowed characters', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid how much owed text', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, 'i don’t owe full amount of £300'))
      expect(errors.length).to.equal(0)
    })
  })
})
