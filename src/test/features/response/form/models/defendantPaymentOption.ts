import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { DefendantPaymentOption, DefendantPaymentType, ValidationErrors } from 'response/form/models/defendantPaymentOption'

describe('DefendantPaymentOption', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(DefendantPaymentOption.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(DefendantPaymentOption.fromObject({})).to.deep.equal(new DefendantPaymentOption())
    })

    it('should deserialize all fields', () => {
      expect(DefendantPaymentOption.fromObject({ option: DefendantPaymentType.INSTALMENTS.value })).to.deep.equal(new DefendantPaymentOption(DefendantPaymentType.INSTALMENTS))
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
      expect(new DefendantPaymentOption().deserialize({ option: { value: DefendantPaymentType.INSTALMENTS.value } })).to.deep.equal(new DefendantPaymentOption(DefendantPaymentType.INSTALMENTS))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new DefendantPaymentOption(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.WHEN_WILL_YOU_PAY_OPTION_REQUIRED)
      })

      it('invalid option', () => {
        const errors = validator.validateSync(new DefendantPaymentOption(new DefendantPaymentType('unknown', '')))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.WHEN_WILL_YOU_PAY_OPTION_REQUIRED)
      })
    })

    describe('should accept when', () => {
      it('option is known', () => {
        DefendantPaymentType.all().forEach(type => {
          const errors = validator.validateSync(new DefendantPaymentOption(type))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
