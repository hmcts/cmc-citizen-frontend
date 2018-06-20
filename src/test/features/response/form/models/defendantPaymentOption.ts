/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { Validator } from 'class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import {
  DefendantPaymentOption, DefendantPaymentType, DefendantPaymentTypeLabels,
  ValidationErrors
} from 'response/form/models/defendantPaymentOption'

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
        const errors = validator.validateSync(new DefendantPaymentOption(new DefendantPaymentType('unknown')))

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

  describe('isOfType', () => {
    it('should return false if option is not set', () => {
      const paymentOption: DefendantPaymentOption = new DefendantPaymentOption()
      expect(paymentOption.isOfType(DefendantPaymentType.INSTALMENTS)).to.be.false
    })

    it('should return true if option is instalments and instalments is passed', () => {
      const paymentOption: DefendantPaymentOption = new DefendantPaymentOption(DefendantPaymentType.INSTALMENTS)
      expect(paymentOption.isOfType(DefendantPaymentType.INSTALMENTS)).to.be.true
    })

    it('should return true if option is instalments and by set date is passed', () => {
      const paymentOption: DefendantPaymentOption = new DefendantPaymentOption(DefendantPaymentType.INSTALMENTS)
      expect(paymentOption.isOfType(DefendantPaymentType.BY_SET_DATE)).to.be.false
    })

    it('should return true if option is by set date and by set date is passed', () => {
      const paymentOption: DefendantPaymentOption = new DefendantPaymentOption(DefendantPaymentType.BY_SET_DATE)
      expect(paymentOption.isOfType(DefendantPaymentType.BY_SET_DATE)).to.be.true
    })

    it('should return true if option is by set date and by instalments is passed', () => {
      const paymentOption: DefendantPaymentOption = new DefendantPaymentOption(DefendantPaymentType.BY_SET_DATE)
      expect(paymentOption.isOfType(DefendantPaymentType.INSTALMENTS)).to.be.false
    })
  })
})

describe('DefendantPaymentType', () => {
  describe('displayValue', () => {
    it(`should return '${DefendantPaymentTypeLabels.IMMEDIATELY}' for IMMEDIATELY`, () => {
      expect(DefendantPaymentType.IMMEDIATELY.displayValue).to.equal(DefendantPaymentTypeLabels.IMMEDIATELY)
    })

    it(`should return '${DefendantPaymentTypeLabels.BY_SET_DATE}' for BY_SET_DATE`, () => {
      expect(DefendantPaymentType.BY_SET_DATE.displayValue).to.equal(DefendantPaymentTypeLabels.BY_SET_DATE)
    })

    it(`should return '${DefendantPaymentTypeLabels.INSTALMENTS}' for INSTALMENTS`, () => {
      expect(DefendantPaymentType.INSTALMENTS.displayValue).to.equal(DefendantPaymentTypeLabels.INSTALMENTS)
    })
  })
})
