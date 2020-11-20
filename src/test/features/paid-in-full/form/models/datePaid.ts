/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import i18next from 'i18next'
import * as postProcessor from 'i18next-sprintf-postprocessor'
i18next.use(postProcessor).init()

import { expect } from 'chai'
import * as moment from 'moment'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { DatePaid } from 'paid-in-full/form/models/datePaid'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { LocalDate, ValidationErrors as LocalDateValidationErrors } from 'forms/models/localDate'

describe('DatePaid', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(DatePaid.fromObject(undefined)).to.be.undefined
    })

    it('should return null when value is null', () => {
      expect(DatePaid.fromObject(null)).to.be.equal(null)
    })

    it('should deserialize all fields', () => {
      expect(DatePaid.fromObject({
        date: {
          year: 2017,
          month: 12,
          day: 31
        }
      })).to.deep.equal(datePaid(2017, 12, 31))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('when date is known', () => {
      it('should reject non existing date', () => {
        const errors = validator.validateSync(datePaid(2017, 2, 29))

        expect(DatePaid.fromObject(null)).to.be.equal(null)
        expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
      })

      it('should accept current date', () => {
        const today = moment()
        const errors = validator.validateSync(datePaid(today.year(), today.month() + 1, today.date()))

        expect(errors.length).to.equal(0)
      })

      it('should accept past date', () => {
        const yesterday = moment().subtract(1, 'days')
        const errors = validator.validateSync(datePaid(yesterday.year(), yesterday.month() + 1, yesterday.date()))

        expect(errors.length).to.equal(0)
      })

      it('should reject date in future', () => {
        const tomorrow = moment().add(1, 'days')
        const errors = validator.validateSync(datePaid(tomorrow.year(), tomorrow.month() + 1, tomorrow.date()))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_IN_FUTURE)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(datePaid(90, 12, 31))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, LocalDateValidationErrors.YEAR_FORMAT_NOT_VALID)
      })
    })

    context('when date is unknown', () => {
      it('should accept undefined date', () => {
        const errors = validator.validateSync(new DatePaid(undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('constructor', () => {
    it('should set fields to undefined', () => {
      let datePaid = new DatePaid()
      expect(datePaid.date).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a DatePaid instance initialised with defaults for undefined', () => {
      expect(new DatePaid().deserialize(undefined)).to.eql(new DatePaid())
    })

    it('should return a DatePaid instance initialised with defaults for null', () => {
      expect(new DatePaid().deserialize(null)).to.eql(new DatePaid())
    })

    it('should set the values of given json on the deserialized instance', () => {
      let deserialized = new DatePaid().deserialize({
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

function datePaid (year: number, month: number, day: number): DatePaid {
  return new DatePaid(new LocalDate(year, month, day))
}
