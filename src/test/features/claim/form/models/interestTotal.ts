/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as _ from 'lodash'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { InterestTotal, ValidationErrors } from 'claim/form/models/interestTotal'

describe('InterestTotal', () => {

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(InterestTotal.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestTotal.fromObject({})).to.deep.equal(new InterestTotal())
    })

    it('should deserialize all fields', () => {
      expect(InterestTotal.fromObject({
        amount: 1000,
        reason: 'Special case'
      })).to.deep.equal(new InterestTotal(1000, 'Special case'))
    })

    it('should convert non numeric amount into numeric type', () => {
      const interest = InterestTotal.fromObject({
        amount: '10',
        reason: 'Special case'
      })

      expect(interest).to.deep.equal(new InterestTotal(10, 'Special case'))
    })
  })

  describe('deserialize', () => {

    it('should return a InterestTotal instance', () => {
      const deserialized = new InterestTotal().deserialize({})
      expect(deserialized).to.be.instanceof(InterestTotal)
    })

    it('should return a InterestTotal instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestTotal().deserialize(undefined)
      expect(deserialized.amount).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestTotal instance with fields set to undefined when given an empty object', () => {
      const deserialized = new InterestTotal().deserialize({})
      expect(deserialized.amount).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestRate instance with fields set when given an object with value', () => {
      const deserialized = new InterestTotal().deserialize({ amount: 1000, reason: 'reason' })
      expect(deserialized.amount).to.be.eq(1000)
      expect(deserialized.reason).to.be.eq('reason')
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject InterestTotal with undefined type', () => {
      const errors = validator.validateSync(new InterestTotal(undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_REQUIRED)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject custom InterestTotal with zero rate', () => {
      const errors = validator.validateSync(new InterestTotal(0, 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_NOT_VALID)
    })

    it('should reject custom InterestTotal with negative rate', () => {
      const errors = validator.validateSync(new InterestTotal(-1, 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.AMOUNT_NOT_VALID)
    })

    it('should reject custom InterestTotal with reason longer then upper limit', () => {
      const errors = validator.validateSync(new InterestTotal(10, _.repeat('*', 10001)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.REASON_TOO_LONG.replace('$constraint1', '10000'))
    })

    it('should accept valid amount and reason', () => {
      const errors = validator.validateSync(new InterestTotal(1000, 'Privileged'))

      expect(errors.length).to.equal(0)
    })
  })
})
