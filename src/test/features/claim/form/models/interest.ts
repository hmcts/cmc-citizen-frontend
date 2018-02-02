/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as _ from 'lodash'
import { Validator } from 'class-validator'

import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { Interest, InterestType, ValidationErrors } from 'claim/form/models/interest'

describe('Interest', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(Interest.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(Interest.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(Interest.fromObject({})).to.deep.equal(new Interest())
    })

    it('should deserialize all fields', () => {
      expect(Interest.fromObject({
        type: InterestType.DIFFERENT,
        rate: 10,
        reason: 'Special case'
      })).to.deep.equal(new Interest(InterestType.DIFFERENT, 10, 'Special case'))
    })

    it('should convert non numeric rate into numeric type', () => {
      const interest = Interest.fromObject({
        type: InterestType.DIFFERENT,
        rate: '10',
        reason: 'Special case'
      })

      expect(interest).to.deep.equal(new Interest(InterestType.DIFFERENT, 10, 'Special case'))
    })

    it('should set standard rate and unset reason when standard type is set', () => {
      expect(Interest.fromObject({
        type: InterestType.STANDARD,
        rate: 100,
        reason: 'Special case'
      })).to.deep.equal(new Interest(InterestType.STANDARD, Interest.STANDARD_RATE, undefined))
    })

    it('should unset both rate and reason when no interest is set', () => {
      expect(Interest.fromObject({
        type: InterestType.NO_INTEREST,
        rate: 100,
        reason: 'Special case'
      })).to.deep.equal(new Interest(InterestType.NO_INTEREST, undefined, undefined))
    })
  })

  describe('deserialize', () => {

    it('should return a ClaimInterest instance', () => {
      let deserialized = new Interest().deserialize({})
      expect(deserialized).to.be.instanceof(Interest)
    })

    it('should return a Interest instance with fields set to default values when given "undefined"', () => {
      let deserialized = new Interest().deserialize(undefined)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.rate).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a Interest instance with fields set to default values when given "null"', () => {
      let deserialized = new Interest().deserialize(null)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.rate).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a Interest instance with fields set to undefined when given an empty object', () => {
      let deserialized = new Interest().deserialize({})
      expect(deserialized.type).to.be.undefined
      expect(deserialized.rate).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a Interest instance with fields set when given an object with value', () => {
      let deserialized = new Interest().deserialize({ type: 'type', rate: 8.00, reason: 'reason' })
      expect(deserialized.type).to.be.eq('type')
      expect(deserialized.rate).to.be.eq(8.00)
      expect(deserialized.reason).to.be.eq('reason')
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject interest with undefined type', () => {
      const errors = validator.validateSync(new Interest(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject interest with unrecognised type', () => {
      const errors = validator.validateSync(new Interest('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject interest with comma', () => {
      const errors = validator.validateSync(Interest.fromObject(
        {
          type: InterestType.DIFFERENT,
          rate: '1,1',
          reason: 'Special case'
        }
      ))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.RATE_NOT_VALID)
    })

    it('should accept interest with recognised type', () => {
      InterestType.all().forEach(type => {
        const errors = validator.validateSync(new Interest(type, 10, 'Privileged'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject custom interest without rate and reason', () => {
      const errors = validator.validateSync(new Interest(InterestType.DIFFERENT, undefined, undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.RATE_REQUIRED)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject custom interest with zero rate', () => {
      const errors = validator.validateSync(new Interest(InterestType.DIFFERENT, 0, 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.RATE_NOT_VALID)
    })

    it('should reject custom interest with negative rate', () => {
      const errors = validator.validateSync(new Interest(InterestType.DIFFERENT, -1, 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.RATE_NOT_VALID)
    })

    it('should reject custom interest with reason longer then upper limit', () => {
      const errors = validator.validateSync(new Interest(InterestType.DIFFERENT, 10, _.repeat('*', 251)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_TOO_LONG.replace('$constraint1', '250'))
    })

    it('should accept valid standard interest', () => {
      const errors = validator.validateSync(new Interest(InterestType.STANDARD))

      expect(errors.length).to.equal(0)
    })

    it('should accept valid custom interest', () => {
      const errors = validator.validateSync(new Interest(InterestType.DIFFERENT, 10, 'Privileged'))

      expect(errors.length).to.equal(0)
    })

    it('should accept valid no interest', () => {
      const errors = validator.validateSync(new Interest(InterestType.NO_INTEREST))

      expect(errors.length).to.equal(0)
    })
  })
})
