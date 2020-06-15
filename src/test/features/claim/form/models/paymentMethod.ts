/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { PaymentMethod, ValidationErrors } from 'claim/form/models/PaymentMethod'

describe('PaymentMethod', () => {
  context('deserialize', () => {

    it('should return an PaymentMethod instance', () => {
      const deserialized = new PaymentMethod().deserialize({})
      expect(deserialized).to.be.instanceof(PaymentMethod)
    })

    it('should return a PaymentMethod instance with fields set to default values when given "undefined"', () => {
      const deserialized = new PaymentMethod().deserialize(undefined)
      expect(deserialized.helpWithFees).to.be.undefined
      expect(deserialized.helpWithFeesNumber).to.be.undefined
    })

    it('should return a PaymentMethod instance with fields set to default values when given "null"', () => {
      const deserialized = new PaymentMethod().deserialize(null)
      expect(deserialized.helpWithFees).to.be.undefined
      expect(deserialized.helpWithFeesNumber).to.be.undefined
    })

    it('should return a PaymentMethod instance with fields set when given an object with value', () => {
      const deserialized = new PaymentMethod().deserialize({
        helpWithFees: true,
        helpWithFeesNumber: 'HWF01234'
      })
      expect(deserialized.helpWithFees).to.be.true
      expect(deserialized.helpWithFeesNumber).to.equal('HWF01234')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject PaymentMethod with undefined type', () => {
      const errors = validator.validateSync(new PaymentMethod(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SELECTION_REQUIRED)
    })

    it('should accept PaymentMethod with recognised values', () => {
      const errors = validator.validateSync(new PaymentMethod(true, 'HWF01234'))
      expect(errors).to.be.empty
    })
  })
})
