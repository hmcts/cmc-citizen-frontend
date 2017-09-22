/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { HowMuchOwed, ValidationErrors } from 'response/form/models/howMuchOwed'

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
      expect(result.amount).to.be.equals(amount)
      expect(result.text).to.be.equals(description)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject how much owed text with undefined', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, undefined))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with text not defined', () => {
      const errors = validator.validateSync(new HowMuchOwed(300))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with empty string', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, ''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much owed text with white spaces string', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, '    '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
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

    it('should reject how much owed text with more than 99000 characters', () => {
      const text = randomstring.generate({
        length: 99001,
        charset: 'alphabetic'
      })
      const errors = validator.validateSync(new HowMuchOwed(300, text))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_NOT_OWE_MONEY_TOO_LONG.replace('$constraint1', '99000'))
    })

    it('should accept how much owed text with 99000 characters', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, randomstring.generate(9900)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid how much owed text', () => {
      const errors = validator.validateSync(new HowMuchOwed(300, 'i don’t owe full amount of £300'))
      expect(errors.length).to.equal(0)
    })
  })
})
