/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { ValidationErrors } from 'app/forms/validation/validationErrors'

import { Interest, InterestOption } from 'claim/form/models/interest'

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
        option: InterestOption.YES
      })).to.deep.equal(new Interest(InterestOption.YES))
    })
  })

  describe('deserialize', () => {

    it('should return an Interest instance', () => {
      const deserialized = new Interest().deserialize({})
      expect(deserialized).to.be.instanceof(Interest)
    })

    it('should return a Interest instance with fields set to default values when given "undefined"', () => {
      const deserialized = new Interest().deserialize(undefined)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a Interest instance with fields set to default values when given "null"', () => {
      const deserialized = new Interest().deserialize(null)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a Interest instance with fields set when given an object with value', () => {
      const deserialized = new Interest().deserialize({ option: InterestOption.YES })
      expect(deserialized.option).to.be.eq(InterestOption.YES)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject interest with undefined type', () => {
      const errors = validator.validateSync(new Interest(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject interest with unrecognised type', () => {
      const errors = validator.validateSync(new Interest('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept interest with recognised type', () => {
      InterestOption.all().forEach(option => {
        const errors = validator.validateSync(new Interest(option))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
