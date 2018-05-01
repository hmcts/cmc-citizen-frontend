/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError, generateString } from './validationUtils'

import { Phone, ValidationErrors } from 'forms/models/phone'
import { ValidationErrors as CommonValidationErrors } from 'app/forms/validation/validationErrors'

describe('Phone', () => {

  describe('constructor', () => {
    it('should have the primitive fields set to undefined', () => {
      let phone = new Phone()
      expect(phone.number).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Phone instance initialised with defaults given undefined', () => {
      expect(new Phone().deserialize(undefined)).to.eql(new Phone())
    })

    it('should return a Phone instance initialised with defaults when given null', () => {
      expect(new Phone().deserialize(null)).to.eql(new Phone())
    })

    it('should return a Phone instance with set fields from given object', () => {
      let result = new Phone().deserialize({
        number: '+447123456789'
      })
      expect(result.number).to.equal('+447123456789')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty phone number', () => {
      const errors = validator.validateSync(new Phone())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NUMBER_REQUIRED)
    })

    it('should reject max allowed characters in phone number', () => {
      const errors = validator.validateSync(new Phone(generateString(31)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.TEXT_TOO_LONG)
    })

    it('should accepts valid phone number', () => {
      const errors = validator.validateSync(new Phone('07555055505'))

      expect(errors.length).to.equal(0)
    })

    it('should accepts valid land line number', () => {
      const errors = validator.validateSync(new Phone('0203 010 3512'))

      expect(errors.length).to.equal(0)
    })
  })
})
