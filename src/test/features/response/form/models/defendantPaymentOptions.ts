import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { DefendantPaymentOption, PaymentType, ValidationErrors } from 'response/form/models/defendantPaymentOption'

describe('DefendantPaymentOption', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(DefendantPaymentOption.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(DefendantPaymentOption.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(DefendantPaymentOption.fromObject({})).to.deep.equal(new DefendantPaymentOption())
    })

    it('should deserialize all fields', () => {
      expect(DefendantPaymentOption.fromObject({ option: PaymentType.INSTALMENTS.value })).to.deep.equal(new DefendantPaymentOption(PaymentType.INSTALMENTS))
    })
  })

  describe('deserialization', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new DefendantPaymentOption().deserialize(undefined)).to.deep.equal(new DefendantPaymentOption())
    })

    it('should return instance initialised with defaults when given null', () => {
      expect(new DefendantPaymentOption().deserialize(null)).to.deep.equal(new DefendantPaymentOption())
    })

    it('should return instance with set fields from given object', () => {
      expect(new DefendantPaymentOption().deserialize({ option: { value: PaymentType.INSTALMENTS.value } })).to.deep.equal(new DefendantPaymentOption(PaymentType.INSTALMENTS))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new DefendantPaymentOption(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })

      it('invalid option', () => {
        const errors = validator.validateSync(new DefendantPaymentOption(new PaymentType('unknown', '')))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })
    })

    describe('should accept when', () => {
      it('option is known', () => {
        PaymentType.all().forEach(type => {
          const errors = validator.validateSync(new DefendantPaymentOption(type))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
