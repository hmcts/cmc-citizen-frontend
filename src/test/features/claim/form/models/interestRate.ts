/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as _ from 'lodash'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { InterestRate, ValidationErrors } from 'claim/form/models/interestRate'
import { InterestRateOption } from 'claim/form/models/interestRateOption'

import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

import { getStandardInterestRate } from 'shared/interestUtils'

describe('InterestRate', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestRate.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(InterestRate.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestRate.fromObject({})).to.deep.equal(new InterestRate())
    })

    it('should deserialize all fields', () => {
      expect(InterestRate.fromObject({
        type: InterestRateOption.DIFFERENT,
        rate: 10,
        reason: 'Special case'
      })).to.deep.equal(new InterestRate(InterestRateOption.DIFFERENT, 10, 'Special case'))
    })

    it('should convert non numeric rate into numeric type', () => {
      const interest = InterestRate.fromObject({
        type: InterestRateOption.DIFFERENT,
        rate: '10',
        reason: 'Special case'
      })

      expect(interest).to.deep.equal(new InterestRate(InterestRateOption.DIFFERENT, 10, 'Special case'))
    })

    it('should set standard rate and unset reason when standard type is set', () => {
      expect(InterestRate.fromObject({
        type: InterestRateOption.STANDARD,
        rate: 100,
        reason: 'Special case'
      })).to.deep.equal(new InterestRate(InterestRateOption.STANDARD, getStandardInterestRate(), undefined))
    })
  })

  describe('deserialize', () => {

    it('should return a InterestRate instance', () => {
      const deserialized = new InterestRate().deserialize({})
      expect(deserialized).to.be.instanceof(InterestRate)
    })

    it('should return a InterestRate instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestRate().deserialize(undefined)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.rate).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestRate instance with fields set to default values when given "null"', () => {
      const deserialized = new InterestRate().deserialize(null)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.rate).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestRate instance with fields set to undefined when given an empty object', () => {
      const deserialized = new InterestRate().deserialize({})
      expect(deserialized.type).to.be.undefined
      expect(deserialized.rate).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestRate instance with fields set when given an object with value', () => {
      const deserialized = new InterestRate().deserialize({ type: 'type', rate: 8.00, reason: 'reason' })
      expect(deserialized.type).to.be.eq('type')
      expect(deserialized.rate).to.be.eq(8.00)
      expect(deserialized.reason).to.be.eq('reason')
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestRate with undefined type', () => {
      const errors = validator.validateSync(new InterestRate(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject InterestRate with unrecognised type', () => {
      const errors = validator.validateSync(new InterestRate('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject InterestRate with a rate with a comma', () => {
      const errors = validator.validateSync(InterestRate.fromObject(
        {
          type: InterestRateOption.DIFFERENT,
          rate: '1,1',
          reason: 'Special case'
        }
      ))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.RATE_NOT_VALID)
    })

    it('should accept InterestRate with recognised type', () => {
      InterestRateOption.all().forEach(type => {
        const errors = validator.validateSync(new InterestRate(type, 10, 'Privileged'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject custom InterestRate without rate and reason', () => {
      const errors = validator.validateSync(new InterestRate(InterestRateOption.DIFFERENT, undefined, undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.RATE_REQUIRED)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject custom InterestRate with zero rate', () => {
      const errors = validator.validateSync(new InterestRate(InterestRateOption.DIFFERENT, 0, 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.RATE_NOT_VALID)
    })

    it('should reject custom InterestRate with negative rate', () => {
      const errors = validator.validateSync(new InterestRate(InterestRateOption.DIFFERENT, -1, 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.RATE_NOT_VALID)
    })

    it('should reject custom InterestRate with reason longer then upper limit', () => {
      const errors = validator.validateSync(new InterestRate(InterestRateOption.DIFFERENT, 10, _.repeat('*', 251)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.REASON_TOO_LONG.replace('$constraint1', '250'))
    })

    it('should accept valid standard interest', () => {
      const errors = validator.validateSync(new InterestRate(InterestRateOption.STANDARD))

      expect(errors.length).to.equal(0)
    })

    it('should accept valid custom interest', () => {
      const errors = validator.validateSync(new InterestRate(InterestRateOption.DIFFERENT, 10, 'Privileged'))

      expect(errors.length).to.equal(0)
    })
  })
})
