/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { BreathingType, BreathingTypeOption, ValidationErrors } from 'breathing-space/models/bsType'

describe('BreathingType', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(BreathingType.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(BreathingType.fromObject({})).to.deep.equal(new BreathingType())
    })

    it('should deserialize all fields', () => {
      expect(BreathingType.fromObject({
        option: BreathingTypeOption.STANDARD
      })).to.deep.equal(new BreathingType(BreathingTypeOption.STANDARD))
    })
  })

  describe('deserialize', () => {

    it('should return an BreathingType instance', () => {
      const deserialized = new BreathingType().deserialize({})
      expect(deserialized).to.be.instanceof(BreathingType)
    })

    it('should return a BreathingType instance with fields set to default values when given "undefined"', () => {
      const deserialized = new BreathingType().deserialize(undefined)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a BreathingType instance with fields set to default values when given "null"', () => {
      const deserialized = new BreathingType().deserialize(null)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a BreathingType instance with fields set when given an object with value', () => {
      const deserialized = new BreathingType().deserialize({ option: BreathingTypeOption.STANDARD })
      expect(deserialized.option).to.be.eq(BreathingTypeOption.STANDARD)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject BreathingType with undefined type', () => {
      const errors = validator.validateSync(new BreathingType(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should accept BreathingType with recognised type', () => {
      BreathingTypeOption.all().forEach(option => {
        const errors = validator.validateSync(new BreathingType(BreathingTypeOption.MENTAL_HEALTH))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
