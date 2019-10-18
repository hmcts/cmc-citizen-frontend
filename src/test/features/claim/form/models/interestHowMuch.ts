/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestHowMuch, ValidationErrors } from 'claim/form/models/interestHowMuch'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

describe('InterestHowMuch', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestHowMuch.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestHowMuch.fromObject({})).to.deep.equal(new InterestHowMuch())
    })

    it('should deserialize all fields', () => {
      expect(InterestHowMuch.fromObject({
        type: InterestRateOption.DIFFERENT,
        dailyAmount: 10.50
      })).to.deep.equal(new InterestHowMuch(InterestRateOption.DIFFERENT, 10.5))
    })

    it('should convert non numeric rate into numeric type', () => {
      const interest = InterestHowMuch.fromObject({
        type: InterestRateOption.DIFFERENT,
        dailyAmount: '10.50'
      })

      expect(interest).to.deep.equal(new InterestHowMuch(InterestRateOption.DIFFERENT, 10.5))
    })
  })

  describe('deserialize', () => {

    it('should return a InterestHowMuch instance', () => {
      const deserialized = new InterestHowMuch().deserialize({})
      expect(deserialized).to.be.instanceof(InterestHowMuch)
    })

    it('should return a InterestHowMuch instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestHowMuch().deserialize(undefined)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.dailyAmount).to.be.undefined
    })

    it('should return a InterestRate instance with fields set to default values when given "null"', () => {
      const deserialized = new InterestHowMuch().deserialize(null)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.dailyAmount).to.be.undefined
    })

    it('should return a InterestRate instance with fields set to undefined when given an empty object', () => {
      const deserialized = new InterestHowMuch().deserialize({})
      expect(deserialized.type).to.be.undefined
      expect(deserialized.dailyAmount).to.be.undefined
    })

    it('should return a InterestRate instance with fields set when given an object with value', () => {
      const deserialized = new InterestHowMuch().deserialize({ type: 'type', dailyAmount: 8.00 })
      expect(deserialized.type).to.be.eq('type')
      expect(deserialized.dailyAmount).to.be.eq(8.00)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestHowMuch with undefined type', () => {
      const errors = validator.validateSync(new InterestHowMuch(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject InterestHowMuch with unrecognised type', () => {
      const errors = validator.validateSync(new InterestHowMuch('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should accept InterestHowMuch with recognised type', () => {
      InterestRateOption.all().forEach(type => {
        const errors = validator.validateSync(new InterestHowMuch(type, 10))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject custom InterestHowMuch without dailyAmount', () => {
      const errors = validator.validateSync(new InterestHowMuch(InterestRateOption.DIFFERENT, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject custom InterestHowMuch with zero dailyAmount', () => {
      const errors = validator.validateSync(new InterestHowMuch(InterestRateOption.DIFFERENT, 0))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_NOT_VALID)
    })

    it('should reject custom InterestHowMuch with negative dailyAmount', () => {
      const errors = validator.validateSync(new InterestHowMuch(InterestRateOption.DIFFERENT, -1))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_NOT_VALID)
    })

    it('should reject dailyAmount with more than two decimal places in amount', () => {
      const errors = validator.validateSync(new InterestHowMuch(InterestRateOption.DIFFERENT, 10.123))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('should accept valid standard interest', () => {
      const errors = validator.validateSync(new InterestHowMuch(InterestRateOption.STANDARD))

      expect(errors.length).to.equal(0)
    })

    it('should accept valid dailyAmount', () => {
      const errors = validator.validateSync(new InterestHowMuch(InterestRateOption.DIFFERENT, 10))

      expect(errors.length).to.equal(0)
    })
  })
})
