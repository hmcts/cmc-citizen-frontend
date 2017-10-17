/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as _ from 'lodash'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'

import { InterestDate, ValidationErrors } from 'claim/form/models/interestDate'
import { LocalDate } from 'forms/models/localDate'
import { InterestDateType } from 'app/common/interestDateType'

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
        type: InterestDateType.CUSTOM,
        date: {
          year: 2016,
          month: 12,
          day: 31
        },
        reason: 'Special case'
      })).to.deep.equal(new InterestDate(InterestDateType.CUSTOM, new LocalDate(2016, 12, 31), 'Special case'))
    })

    it('should unset both date and reason when submission type is set', () => {
      expect(InterestDate.fromObject({
        type: InterestDateType.SUBMISSION,
        date: {
          year: 2016,
          month: 12,
          day: 31
        },
        reason: 'Special case'
      })).to.deep.equal(new InterestDate(InterestDateType.SUBMISSION, undefined, undefined))
    })
  })

  describe('deserialize', () => {
    it('should return a InterestDate instance with fields set to default values when given "undefined"', () => {
      let deserialized = new InterestDate().deserialize(undefined)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.date).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestDate instance with fields set to default values when given "null"', () => {
      let deserialized = new InterestDate().deserialize(null)
      expect(deserialized.type).to.be.undefined
      expect(deserialized.date).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestDate instance with fields set when given an object with value', () => {
      let deserialized = new InterestDate().deserialize({
        type: 'type',
        date: {
          day: 10,
          month: 12,
          year: 2016
        },
        reason: 'reason'
      })
      expect(deserialized.type).to.equal('type')
      expect(deserialized.reason).to.equal('reason')
      expect(deserialized.date.day).to.equal(10)
      expect(deserialized.date.month).to.equal(12)
      expect(deserialized.date.year).to.equal(2016)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject interest date with undefined type', () => {
      const errors = validator.validateSync(new InterestDate(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should reject interest date with unrecognised type', () => {
      const errors = validator.validateSync(new InterestDate('unrecognised-type'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.TYPE_REQUIRED)
    })

    it('should accept interest date with recognised type', () => {
      InterestDateType.all().forEach(type => {
        const errors = validator.validateSync(new InterestDate(type, new LocalDate(2016, 12, 24), 'Privileged'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject custom interest date without date and reason', () => {
      const errors = validator.validateSync(new InterestDate(InterestDateType.CUSTOM, undefined, undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject custom interest date with invalid date', () => {
      const errors = validator.validateSync(new InterestDate(InterestDateType.CUSTOM, new LocalDate(2016, 2, 30), 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
    })

    it('should reject custom interest date with invalid digits in year', () => {
      const errors = validator.validateSync(new InterestDate(InterestDateType.CUSTOM, new LocalDate(80, 12, 30), 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DATE_INVALID_YEAR)
    })

    it('should reject custom interest date with reason longer then upper limit', () => {
      const errors = validator.validateSync(new InterestDate(InterestDateType.CUSTOM, new LocalDate(2016, 12, 24), _.repeat('*', 251)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_TOO_LONG.replace('$constraint1', '250'))
    })

    it('should accept valid submission interest date', () => {
      const errors = validator.validateSync(new InterestDate(InterestDateType.SUBMISSION))

      expect(errors.length).to.equal(0)
    })

    it('should accept valid custom interest date', () => {
      const errors = validator.validateSync(new InterestDate(InterestDateType.CUSTOM, new LocalDate(2016, 12, 24), 'Privileged'))

      expect(errors.length).to.equal(0)
    })
  })
})
