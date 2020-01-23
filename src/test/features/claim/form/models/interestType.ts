/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { InterestType, InterestTypeOption, ValidationErrors } from 'claim/form/models/interestType'

describe('InterestType', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestType.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(InterestType.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestType.fromObject({})).to.deep.equal(new InterestType())
    })

    it('should deserialize all fields', () => {
      expect(InterestType.fromObject({
        option: InterestTypeOption.SAME_RATE
      })).to.deep.equal(new InterestType(InterestTypeOption.SAME_RATE))
    })
  })

  describe('deserialize', () => {

    it('should return an InterestType instance', () => {
      const deserialized = new InterestType().deserialize({})
      expect(deserialized).to.be.instanceof(InterestType)
    })

    it('should return a InterestType instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestType().deserialize(undefined)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a InterestType instance with fields set to default values when given "null"', () => {
      const deserialized = new InterestType().deserialize(null)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a InterestType instance with fields set when given an object with value', () => {
      const deserialized = new InterestType().deserialize({ option: InterestTypeOption.SAME_RATE })
      expect(deserialized.option).to.be.eq(InterestTypeOption.SAME_RATE)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestType with undefined type', () => {
      const errors = validator.validateSync(new InterestType(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.INTEREST_TYPE_REQUIRED)
    })

    it('should reject InterestType with unrecognised type', () => {
      const errors = validator.validateSync(new InterestType('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.INTEREST_TYPE_REQUIRED)
    })

    it('should accept InterestType with recognised type', () => {
      InterestTypeOption.all().forEach(option => {
        const errors = validator.validateSync(new InterestType(option))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
