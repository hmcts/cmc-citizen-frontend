/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors } from 'forms/validation/validationErrors'

import { Interest } from 'claim/form/models/interest'
import { YesNoOption } from 'models/yesNoOption'

describe('Interest', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(Interest.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(Interest.fromObject({})).to.deep.equal(new Interest())
    })

    it('should deserialize all fields', () => {
      expect(Interest.fromObject({
        option: YesNoOption.YES.option
      })).to.deep.equal(new Interest(YesNoOption.YES))
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
      const deserialized = new Interest().deserialize({ option: YesNoOption.YES })
      expect(deserialized.option).to.be.eq(YesNoOption.YES)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject interest with undefined type', () => {
      const errors = validator.validateSync(new Interest(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept interest with recognised type', () => {
      YesNoOption.all().forEach(option => {
        const errors = validator.validateSync(new Interest(option))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
