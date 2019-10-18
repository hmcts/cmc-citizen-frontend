/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { InterestDate, ValidationErrors } from 'claim/form/models/interestDate'
import { InterestDateType } from 'common/interestDateType'

describe('InterestDate', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestDate.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(InterestDate.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestDate.fromObject({})).to.deep.equal(new InterestDate())
    })

    it('should deserialize all fields', () => {
      expect(InterestDate.fromObject({
        type: InterestDateType.SUBMISSION
      })).to.deep.equal(new InterestDate(InterestDateType.SUBMISSION))
    })
  })

  describe('deserialize', () => {

    it('should return an InterestDate instance', () => {
      const deserialized = new InterestDate().deserialize({})
      expect(deserialized).to.be.instanceof(InterestDate)
    })

    it('should return a InterestDate instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestDate().deserialize(undefined)
      expect(deserialized.type).to.be.undefined
    })

    it('should return a InterestDate instance with fields set to default values when given "null"', () => {
      const deserialized = new InterestDate().deserialize(null)
      expect(deserialized.type).to.be.undefined
    })

    it('should return a InterestDate instance with fields set when given an object with value', () => {
      const deserialized = new InterestDate().deserialize({ type: InterestDateType.CUSTOM })
      expect(deserialized.type).to.be.eq(InterestDateType.CUSTOM)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestDate with undefined type', () => {
      const errors = validator.validateSync(new InterestDate(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject InterestDate with unrecognised type', () => {
      const errors = validator.validateSync(new InterestDate('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should accept InterestDate with recognised type', () => {
      InterestDateType.all().forEach(type => {
        const errors = validator.validateSync(new InterestDate(type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
