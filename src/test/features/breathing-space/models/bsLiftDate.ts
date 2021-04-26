/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import * as i18next from 'i18next'
import * as postProcessor from 'i18next-sprintf-postprocessor'
i18next.use(postProcessor).init()

import { expect } from 'chai'
import * as moment from 'moment'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors, BreathingSpaceLiftDate } from 'breathing-space/models/bsLiftDate'
import { LocalDate } from 'forms/models/localDate'

describe('BreathingSpaceLiftDate', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(BreathingSpaceLiftDate.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(BreathingSpaceLiftDate.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(BreathingSpaceLiftDate.fromObject({})).to.deep.equal(new BreathingSpaceLiftDate())
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

      it('should reject FUTURE date', () => {
        const today = moment()
        const errors = validator.validateSync(dateOfBirth(today.year(), today.month() + 2, today.date()))
        expect(errors.length).to.equal(1)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(dateOfBirth(90, 12, 31))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
      })

      it('should reject future date', () => {
        const errors = validator.validateSync(dateOfBirth(9999, 12, 12))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_IN_FUTURE)
      })
    })

    context('when date is unknown', () => {
      it('should accept undefined date', () => {
        const errors = validator.validateSync(new BreathingSpaceLiftDate(undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('constructor', () => {
    it('should set fields to undefined', () => {
      let date = new BreathingSpaceLiftDate()
      expect(date.respiteLiftDate).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a BreathingSpaceLiftDate instance initialised with defaults for undefined', () => {
      expect(new BreathingSpaceLiftDate().deserialize(undefined)).to.eql(new BreathingSpaceLiftDate())
    })

    it('should return a BreathingSpaceLiftDate instance initialised with defaults for null', () => {
      expect(new BreathingSpaceLiftDate().deserialize(null)).to.eql(new BreathingSpaceLiftDate())
    })

    it('should set the values of given json on the deserialized instance', () => {
      let deserialized = new BreathingSpaceLiftDate().deserialize({
        respiteLiftDate: {
          day: 10,
          month: 11,
          year: 2000
        }
      })
      expect(deserialized.respiteLiftDate.day).to.equal(10)
      expect(deserialized.respiteLiftDate.month).to.equal(11)
      expect(deserialized.respiteLiftDate.year).to.equal(2000)
    })
  })
})

function dateOfBirth (year: number, month: number, day: number): BreathingSpaceLiftDate {
  return new BreathingSpaceLiftDate(new LocalDate(year, month, day))
}
