/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { InterestContinueClaiming } from 'claim/form/models/interestContinueClaiming'
import { YesNoOption } from 'models/yesNoOption'

describe('InterestContinueClaiming', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestContinueClaiming.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestContinueClaiming.fromObject({})).to.deep.equal(new InterestContinueClaiming())
    })

    it('should deserialize all fields', () => {
      expect(InterestContinueClaiming.fromObject({
        option: YesNoOption.NO.option
      })).to.deep.equal(new InterestContinueClaiming(YesNoOption.NO))
    })
  })

  describe('deserialize', () => {

    it('should return a InterestContinueClaiming instance', () => {
      const deserialized = new InterestContinueClaiming().deserialize({})
      expect(deserialized).to.be.instanceof(InterestContinueClaiming)
    })

    it('should return a InterestContinueClaiming instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestContinueClaiming().deserialize(undefined)
      expect(deserialized.option).to.be.undefined
    })

    it('should return a InterestContinueClaiming instance with fields set to undefined when given an empty object', () => {
      const deserialized = new InterestContinueClaiming().deserialize({})
      expect(deserialized.option).to.be.undefined
    })

    it('should return a InterestRate instance with fields set when given an object with value', () => {
      const deserialized = new InterestContinueClaiming().deserialize({ option: YesNoOption.NO })
      expect(deserialized.option).to.be.eq(YesNoOption.NO)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestContinueClaiming with undefined type', () => {
      const errors = validator.validateSync(new InterestContinueClaiming(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.YES_NO_REQUIRED)
    })

    it('should accept InterestContinueClaiming with recognised type', () => {
      YesNoOption.all().forEach(option => {
        const errors = validator.validateSync(new InterestContinueClaiming(option))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
