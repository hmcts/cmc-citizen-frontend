import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { LocalDate, ValidationErrors } from 'forms/models/localDate'
import moment = require('moment')

describe('LocalDate', () => {

  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(LocalDate.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(LocalDate.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(LocalDate.fromObject({ a: 1, b: 1, c: 2 })).to.deep.equal(new LocalDate())
    })

    it('should deserialize all fields', () => {
      expect(LocalDate.fromObject({ year: 2017, month: 12, day: 31 })).to.deep.equal(new LocalDate(2017, 12, 31))
    })

    it('should convert non numeric field values into numeric type', () => {
      expect(LocalDate.fromObject({ year: '2017', month: '12', day: '31' })).to.deep.equal(new LocalDate(2017, 12, 31))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject empty date', () => {
      const errors = validator.validateSync(new LocalDate())

      expect(errors.length).to.equal(3)
      expectValidationError(errors, ValidationErrors.YEAR_NOT_VALID)
      expectValidationError(errors, ValidationErrors.MONTH_NOT_VALID)
      expectValidationError(errors, ValidationErrors.DAY_NOT_VALID)
    })

    it('should reject date with negative values', () => {
      const errors = validator.validateSync(new LocalDate(-1, -1, -1))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, ValidationErrors.YEAR_NOT_VALID)
      expectValidationError(errors, ValidationErrors.MONTH_NOT_VALID)
      expectValidationError(errors, ValidationErrors.DAY_NOT_VALID)
    })

    it('should reject date with values greater then upper limit', () => {
      const errors = validator.validateSync(new LocalDate(10000, 13, 32))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, ValidationErrors.YEAR_NOT_VALID)
      expectValidationError(errors, ValidationErrors.MONTH_NOT_VALID)
      expectValidationError(errors, ValidationErrors.DAY_NOT_VALID)
    })

    it('should accept date withing the range limit', () => {
      expect(validator.validateSync(new LocalDate(1000, 1, 1)).length).to.equal(0)
      expect(validator.validateSync(new LocalDate(9999, 12, 31)).length).to.equal(0)
    })

    it('should accept valid date', () => {
      expect(validator.validateSync(new LocalDate(2017, 12, 31)).length).to.equal(0)
    })
  })

  describe('fromMoment', () => {
    it('should return LocalDate from moment object', () => {
      expect(LocalDate.fromMoment(moment('2018-01-01'))).to.deep.equal(new LocalDate(2018,1,1))
      expect(LocalDate.fromMoment(moment('2018-12-01'))).to.deep.equal(new LocalDate(2018,12,1))
    })
  })

  describe('toMoment method', () => {
    it('should return Moment instance', () => {
      const moment = new LocalDate(2017, 12, 31).toMoment()

      expect(moment.year()).to.be.equal(2017)
      expect(moment.month()).to.be.equal(11) // Moment months are zero indexed
      expect(moment.date()).to.be.equal(31)
    })
  })

  describe('asString method', () => {
    it('should return empty string for undefined year, month and day', () => {
      expect(new LocalDate().asString()).to.be.equal('')
    })
    it('should return string containing year, month and day', () => {
      expect(new LocalDate(2017, 12, 31).asString()).to.be.equal('2017-12-31')
    })
    it('should return padded string', () => {
      expect(new LocalDate(2017, 5, 6).asString()).to.be.equal('2017-05-06')
    })
  })
})
