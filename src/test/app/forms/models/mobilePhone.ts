/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { MobilePhone, ValidationErrors } from 'forms/models/mobilePhone'

describe('MobilePhone', () => {

  describe('constructor', () => {
    it('should have the primitive fields set to undefined', () => {
      let mobilePhone = new MobilePhone()
      expect(mobilePhone.number).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a MobilePhone instance initialised with defaults given undefined', () => {
      expect(new MobilePhone().deserialize(undefined)).to.eql(new MobilePhone())
    })

    it('should return a MobilePhone instance initialised with defaults when given null', () => {
      expect(new MobilePhone().deserialize(null)).to.eql(new MobilePhone())
    })

    it('should return a MobilePhone instance with set fields from given object', () => {
      let result = new MobilePhone().deserialize({
        number: '+447123456789'
      })
      expect(result.number).to.equal('+447123456789')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty mobile number', () => {
      const errors = validator.validateSync(new MobilePhone())

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NUMBER_REQUIRED)
    })

    it('should accepts valid mobile number', () => {
      const errors = validator.validateSync(new MobilePhone('07555055505'))

      expect(errors.length).to.equal(0)
    })
  })
})
