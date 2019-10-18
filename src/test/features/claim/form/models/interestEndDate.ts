/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { InterestEndDate, InterestEndDateOption, ValidationErrors } from 'claim/form/models/interestEndDate'

describe('InterestEndDate', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestEndDate.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(InterestEndDate.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestEndDate.fromObject({})).to.deep.equal(new InterestEndDate())
    })

    it('should deserialize all fields', () => {
      expect(InterestEndDate.fromObject({
        option: InterestEndDateOption.SUBMISSION
      })).to.deep.equal(new InterestEndDate(InterestEndDateOption.SUBMISSION))
    })
  })

  describe('deserialize', () => {

    it('should return an InterestEndDate instance', () => {
      const deserialized = new InterestEndDate().deserialize({})
      expect(deserialized).to.be.instanceof(InterestEndDate)
    })

    it('should return a InterestEndDate instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestEndDate().deserialize(undefined)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a InterestEndDate instance with fields set to default values when given "null"', () => {
      const deserialized = new InterestEndDate().deserialize(null)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a InterestEndDate instance with fields set when given an object with value', () => {
      const deserialized = new InterestEndDate().deserialize({ option: InterestEndDateOption.SETTLED_OR_JUDGMENT })
      expect(deserialized.option).to.be.eq(InterestEndDateOption.SETTLED_OR_JUDGMENT)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestEndDate with undefined type', () => {
      const errors = validator.validateSync(new InterestEndDate(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.INTEREST_END_DATE_REQUIRED)
    })

    it('should reject InterestEndDate with unrecognised type', () => {
      const errors = validator.validateSync(new InterestEndDate('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.INTEREST_END_DATE_REQUIRED)
    })

    it('should accept InterestEndDate with recognised type', () => {
      InterestEndDateOption.all().forEach(option => {
        const errors = validator.validateSync(new InterestEndDate(option))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
