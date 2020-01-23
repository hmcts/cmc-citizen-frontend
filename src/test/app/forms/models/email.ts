/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { Email, ValidationErrors } from 'forms/models/email'

describe('Email', () => {

  describe('constructor', () => {

    it('should set the primitive fields to undefined', () => {
      let email = new Email()
      expect(email.address).to.be.undefined
    })
  })

  describe('deserialize', () => {

    it('should return a Email instance initialised with defaults for undefined', () => {
      expect(new Email().deserialize(undefined)).to.eql(new Email())
    })

    it('should return a Email instance initialised with defaults for null', () => {
      expect(new Email().deserialize(null)).to.eql(new Email())
    })

    it('should return a Email instance with set field "address" from given object', () => {
      let result = new Email().deserialize({
        address: 'myemail@domain.com'
      })
      expect(result.address).to.be.equals('myemail@domain.com')
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject undefined address', () => {
      const errors = validator.validateSync(new Email(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.ADDRESS_NOT_VALID)
    })

    it('should reject null address', () => {
      const errors = validator.validateSync(new Email(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.ADDRESS_NOT_VALID)
    })

    it('should reject invalid address', () => {
      const errors = validator.validateSync(new Email('admin@'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.ADDRESS_NOT_VALID)
    })

    it('should accept valid address', () => {
      const errors = validator.validateSync(new Email('admin@example.com'))

      expect(errors.length).to.equal(0)
    })
  })

  describe('task state', () => {

    context('is incomplete', () => {

      it('when address is undefined', () => {
        const state = new Email(undefined)
        expect(state.isCompleted()).to.be.false
      })

      it('when address is null', () => {
        const state = new Email(null)
        expect(state.isCompleted()).to.be.false
      })

      it('when address is invalid', () => {
        const state = new Email('some-text')
        expect(state.isCompleted()).to.be.false
      })
    })

    context('is complete', () => {

      it('when address is valid', () => {
        const state = new Email('user@example.com')
        expect(state.isCompleted()).to.be.true
      })
    })
  })
})
