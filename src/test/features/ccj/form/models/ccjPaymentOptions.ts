import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { CCJPaymentOption, PaymentType, ValidationErrors } from 'ccj/form/models/ccjPaymentOption'

describe('CCJPaymentOption', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(CCJPaymentOption.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(CCJPaymentOption.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(CCJPaymentOption.fromObject({})).to.deep.equal(new CCJPaymentOption())
    })

    it('should deserialize all fields', () => {
      expect(CCJPaymentOption.fromObject({ option: PaymentType.IMMEDIATELY.value })).to.deep.equal(new CCJPaymentOption(PaymentType.IMMEDIATELY))
    })
  })

  describe('deserialization', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new CCJPaymentOption().deserialize(undefined)).to.deep.equal(new CCJPaymentOption())
    })

    it('should return instance initialised with defaults when given null', () => {
      expect(new CCJPaymentOption().deserialize(null)).to.deep.equal(new CCJPaymentOption())
    })

    it('should return instance with set fields from given object', () => {
      expect(new CCJPaymentOption().deserialize({ option: { value: PaymentType.IMMEDIATELY.value } })).to.deep.equal(new CCJPaymentOption(PaymentType.IMMEDIATELY))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new CCJPaymentOption(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })

      it('invalid option', () => {
        const errors = validator.validateSync(new CCJPaymentOption(new PaymentType('unknown', '')))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })
    })

    describe('should accept when', () => {
      it('option is known', () => {
        PaymentType.all().forEach(type => {
          const errors = validator.validateSync(new CCJPaymentOption(type))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
