/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import * as i18next from 'i18next'
import * as postProcessor from 'i18next-sprintf-postprocessor'
i18next.use(postProcessor).init()

import { expect } from 'chai'
import * as moment from 'moment'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors, BreathingSpaceRespiteEnd } from 'breathing-space/models/bsEndDate'
import { LocalDate } from 'forms/models/localDate'

describe('BreathingSpaceRespiteEnd', () => {
  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(BreathingSpaceRespiteEnd.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(BreathingSpaceRespiteEnd.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(BreathingSpaceRespiteEnd.fromObject({})).to.deep.equal(new BreathingSpaceRespiteEnd())
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
        const errors = validator.validateSync(dateOfBirth(today.year(), today.month() - 1, today.date()))
        expect(errors.length).to.equal(1)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(dateOfBirth(90, 12, 31))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
      })
    })

    context('when date is unknown', () => {
      it('should accept undefined date', () => {
        const errors = validator.validateSync(new BreathingSpaceRespiteEnd(undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('constructor', () => {
    it('should set fields to undefined', () => {
      let date = new BreathingSpaceRespiteEnd()
      expect(date.respiteEnd).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a BreathingSpaceRespiteEnd instance initialised with defaults for undefined', () => {
      expect(new BreathingSpaceRespiteEnd().deserialize(undefined)).to.eql(new BreathingSpaceRespiteEnd())
    })

    it('should return a BreathingSpaceRespiteEnd instance initialised with defaults for null', () => {
      expect(new BreathingSpaceRespiteEnd().deserialize(null)).to.eql(new BreathingSpaceRespiteEnd())
    })

    it('should set the values of given json on the deserialized instance', () => {
      let deserialized = new BreathingSpaceRespiteEnd().deserialize({
        respiteEnd: {
          day: 10,
          month: 11,
          year: 2000
        }
      })
      expect(deserialized.respiteEnd.day).to.equal(10)
      expect(deserialized.respiteEnd.month).to.equal(11)
      expect(deserialized.respiteEnd.year).to.equal(2000)
    })
  })
})

function dateOfBirth (year: number, month: number, day: number): BreathingSpaceRespiteEnd {
  return new BreathingSpaceRespiteEnd(new LocalDate(year, month, day))
}
