/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import i18next from 'i18next'
import * as postProcessor from 'i18next-sprintf-postprocessor'
i18next.use(postProcessor).init()

import { expect } from 'chai'
import * as moment from 'moment'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { DateOfBirth, ValidationErrors } from 'forms/models/dateOfBirth'
import { LocalDate, ValidationErrors as LocalDateValidationErrors } from 'forms/models/localDate'

import { MomentFormatter } from 'utils/momentFormatter'

describe('DateOfBirth', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(DateOfBirth.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(DateOfBirth.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(DateOfBirth.fromObject({})).to.deep.equal(new DateOfBirth())
    })

    it('should deserialize all fields', () => {
      expect(DateOfBirth.fromObject({
        known: 'true',
        date: {
          year: 2017,
          month: 12,
          day: 31
        }
      })).to.deep.equal(dateOfBirth(2017, 12, 31))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('when date is known', () => {
      it('should reject non existing date', () => {
        const errors = validator.validateSync(dateOfBirth(2017, 2, 29))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
      })

      it('should reject current date', () => {
        const today = moment()

        const errors = validator.validateSync(dateOfBirth(today.year(), today.month() + 1, today.date()))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_UNDER_18.replace('%s', MomentFormatter.formatLongDate(ageLimit())))
      })

      it('should reject future date', () => {
        const tomorrow = moment().add(1, 'days')

        const errors = validator.validateSync(dateOfBirth(tomorrow.year(), tomorrow.month() + 1, tomorrow.date()))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_UNDER_18.replace('%s', MomentFormatter.formatLongDate(ageLimit())))
      })

      it('should reject date of birth below 18', () => {
        const almost18YearsAgo = moment().subtract(18, 'years').add(1, 'days')

        const errors = validator.validateSync(dateOfBirth(almost18YearsAgo.year(), almost18YearsAgo.month() + 1, almost18YearsAgo.date()))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_UNDER_18.replace('%s', MomentFormatter.formatLongDate(ageLimit())))
      })

      it('should reject date of birth with age over 150', () => {
        const over150YearsAgo = moment().subtract(151, 'years')

        const errors = validator.validateSync(dateOfBirth(over150YearsAgo.year(), over150YearsAgo.month() + 1, over150YearsAgo.date()))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
      })

      it('should accept date of birth of 18 and over', () => {
        const exactly18YearsAgo = moment().subtract(18, 'years')

        const errors = validator.validateSync(dateOfBirth(exactly18YearsAgo.year(), exactly18YearsAgo.month() + 1, exactly18YearsAgo.date()))

        expect(errors.length).to.equal(0)
      })

      it('should reject date of birth with invalid digits in year', () => {
        const errors = validator.validateSync(dateOfBirth(90, 12, 31))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, LocalDateValidationErrors.YEAR_FORMAT_NOT_VALID)
      })
    })

    context('when date is unknown', () => {
      it('should accept undefined date', () => {
        const errors = validator.validateSync(new DateOfBirth(false, undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('constructor', () => {
    it('should set fields to undefined', () => {
      let dateOfBirth = new DateOfBirth()
      expect(dateOfBirth.known).to.be.undefined
      expect(dateOfBirth.date).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a DateOfBirth instance initialised with defaults for undefined', () => {
      expect(new DateOfBirth().deserialize(undefined)).to.eql(new DateOfBirth())
    })

    it('should return a DateOfBirth instance initialised with defaults for null', () => {
      expect(new DateOfBirth().deserialize(null)).to.eql(new DateOfBirth())
    })

    it('should set the values of given json on the deserialized instance', () => {
      let deserialized = new DateOfBirth().deserialize({
        known: true,
        date: {
          day: 10,
          month: 11,
          year: 2000
        }
      })
      expect(deserialized.date.day).to.equal(10)
      expect(deserialized.date.month).to.equal(11)
      expect(deserialized.date.year).to.equal(2000)
    })
  })
})

function dateOfBirth (year: number, month: number, day: number): DateOfBirth {
  return new DateOfBirth(true, new LocalDate(year, month, day))
}

function ageLimit (): moment.Moment {
  return moment().subtract(18, 'years').add(1, 'day')
}
