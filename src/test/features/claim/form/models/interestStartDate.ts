/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as _ from 'lodash'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { InterestStartDate, ValidationErrors } from 'claim/form/models/interestStartDate'
import { LocalDate, ValidationErrors as LocalDateValidationErrors } from 'forms/models/localDate'
import { InterestDateType } from 'common/interestDateType'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

describe('InterestStartDate', () => {

  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(InterestStartDate.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(InterestStartDate.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(InterestStartDate.fromObject({})).to.deep.equal(new InterestStartDate())
    })

    it('should deserialize all fields', () => {
      expect(InterestStartDate.fromObject({
        date: {
          year: 2016,
          month: 12,
          day: 31
        },
        reason: 'Special case'
      })).to.deep.equal(new InterestStartDate(new LocalDate(2016, 12, 31), 'Special case'))
    })
  })

  describe('deserialize', () => {
    it('should return a InterestStartDate instance with fields set to default values when given "undefined"', () => {
      const deserialized = new InterestStartDate().deserialize(undefined)
      expect(deserialized.date).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestStartDate instance with fields set to default values when given "null"', () => {
      const deserialized = new InterestStartDate().deserialize(null)
      expect(deserialized.date).to.be.undefined
      expect(deserialized.reason).to.be.undefined
    })

    it('should return a InterestStartDate instance with fields set when given an object with value', () => {
      const deserialized = new InterestStartDate().deserialize({
        date: {
          day: 10,
          month: 12,
          year: 2016
        },
        reason: 'reason'
      })
      expect(deserialized.reason).to.equal('reason')
      expect(deserialized.date.day).to.equal(10)
      expect(deserialized.date.month).to.equal(12)
      expect(deserialized.date.year).to.equal(2016)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should accept interest date with recognised type', () => {
      InterestDateType.all().forEach(type => {
        const errors = validator.validateSync(new InterestStartDate(new LocalDate(2016, 12, 24), 'Privileged'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject custom InterestStartDate date without date and reason', () => {
      const errors = validator.validateSync(new InterestStartDate(undefined, undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, CommonValidationErrors.DATE_REQUIRED)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject custom InterestStartDate date with invalid date', () => {
      const errors = validator.validateSync(new InterestStartDate(new LocalDate(2016, 2, 30), 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.DATE_NOT_VALID)
    })

    it('should reject custom InterestStartDate date with invalid digits in year', () => {
      const errors = validator.validateSync(new InterestStartDate(new LocalDate(80, 12, 30), 'Privileged'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, LocalDateValidationErrors.YEAR_FORMAT_NOT_VALID)
    })

    it('should reject custom InterestStartDate date with reason longer then upper limit', () => {
      const errors = validator.validateSync(new InterestStartDate(new LocalDate(2016, 12, 24), _.repeat('*', 10001)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.REASON_TOO_LONG.replace('$constraint1', '10000'))
    })

    it('should accept valid custom interest date', () => {
      const errors = validator.validateSync(new InterestStartDate(new LocalDate(2016, 12, 24), 'Privileged'))

      expect(errors.length).to.equal(0)
    })
  })
})
