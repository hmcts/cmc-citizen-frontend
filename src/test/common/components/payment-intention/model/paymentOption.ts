/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import {
  PaymentOption, PaymentType, PaymentTypeLabels,
  ValidationErrors
} from 'shared/components/payment-intention/model/paymentOption'

describe('PaymentOption', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(PaymentOption.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(PaymentOption.fromObject({})).to.deep.equal(new PaymentOption())
    })

    it('should deserialize all fields', () => {
      expect(PaymentOption.fromObject({ option: PaymentType.INSTALMENTS.value })).to.deep.equal(new PaymentOption(PaymentType.INSTALMENTS))
    })
  })

  describe('deserialization', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new PaymentOption().deserialize(undefined)).to.deep.equal(new PaymentOption())
    })

    it('should return instance initialised with defaults when given null', () => {
      expect(new PaymentOption().deserialize(null)).to.deep.equal(new PaymentOption())
    })

    it('should return instance with set fields from given object', () => {
      expect(new PaymentOption().deserialize({ option: { value: PaymentType.INSTALMENTS.value } })).to.deep.equal(new PaymentOption(PaymentType.INSTALMENTS))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined option', () => {
        const errors = validator.validateSync(new PaymentOption(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })

      it('invalid option', () => {
        const errors = validator.validateSync(new PaymentOption(new PaymentType('unknown')))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.OPTION_REQUIRED)
      })
    })

    describe('should accept when', () => {
      it('option is known', () => {
        PaymentType.all().forEach(type => {
          const errors = validator.validateSync(new PaymentOption(type))

          expect(errors.length).to.equal(0)
        })
      })
    })
  })

  describe('isOfType', () => {
    it('should return false if option is not set', () => {
      const paymentOption: PaymentOption = new PaymentOption()
      expect(paymentOption.isOfType(PaymentType.INSTALMENTS)).to.be.false
    })

    it('should return true if option is instalments and instalments is passed', () => {
      const paymentOption: PaymentOption = new PaymentOption(PaymentType.INSTALMENTS)
      expect(paymentOption.isOfType(PaymentType.INSTALMENTS)).to.be.true
    })

    it('should return true if option is instalments and by set date is passed', () => {
      const paymentOption: PaymentOption = new PaymentOption(PaymentType.INSTALMENTS)
      expect(paymentOption.isOfType(PaymentType.BY_SET_DATE)).to.be.false
    })

    it('should return true if option is by set date and by set date is passed', () => {
      const paymentOption: PaymentOption = new PaymentOption(PaymentType.BY_SET_DATE)
      expect(paymentOption.isOfType(PaymentType.BY_SET_DATE)).to.be.true
    })

    it('should return true if option is by set date and by instalments is passed', () => {
      const paymentOption: PaymentOption = new PaymentOption(PaymentType.BY_SET_DATE)
      expect(paymentOption.isOfType(PaymentType.INSTALMENTS)).to.be.false
    })
  })
})

describe('PaymentType', () => {
  describe('displayValue', () => {
    it(`should return '${PaymentTypeLabels.IMMEDIATELY}' for IMMEDIATELY`, () => {
      expect(PaymentType.IMMEDIATELY.displayValue).to.equal(PaymentTypeLabels.IMMEDIATELY)
    })

    it(`should return '${PaymentTypeLabels.BY_SET_DATE}' for BY_SET_DATE`, () => {
      expect(PaymentType.BY_SET_DATE.displayValue).to.equal(PaymentTypeLabels.BY_SET_DATE)
    })

    it(`should return '${PaymentTypeLabels.INSTALMENTS}' for INSTALMENTS`, () => {
      expect(PaymentType.INSTALMENTS.displayValue).to.equal(PaymentTypeLabels.INSTALMENTS)
    })
  })
})
