import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import Offer from 'offer/form/models/offer'
import { ValidationErrors } from 'offer/form/models/offer'
import { LocalDate } from 'forms/models/localDate'
import * as moment from 'moment'

describe('Offer', () => {
  describe('constructor', () => {
    it('should set the fields to undefined', () => {
      const offer = new Offer()
      expect(offer.text).to.be.equal(undefined)
      expect(offer.date).to.be.equal(undefined)
    })
  })

  describe('form object deserialization', () => {
    it('should return undefined when value is undefined', () => {
      expect(Offer.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(Offer.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(Offer.fromObject({})).to.deep.equal(new Offer())
    })

    it('should deserialize all fields', () => {
      const futureDate = moment().add(10, 'days')
      const date = new LocalDate(futureDate.year(), futureDate.month(), futureDate.day())
      expect(Offer.fromObject({ text: 'offer Text', date: date })).to.deep.equal(new Offer('offer Text', date))
    })
  })

  describe('deserialization', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new Offer().deserialize(undefined)).to.deep.equal(new Offer())
    })

    it('should return instance initialised with defaults when given null', () => {
      expect(new Offer().deserialize(null)).to.deep.equal(new Offer())
    })

    it('should return instance with set fields from given object', () => {
      const date = new LocalDate()
      expect(new Offer().deserialize({ text: 'offer Text', date: date.asString() })).to.deep.equal(new Offer('offer Text', date))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('should reject when', () => {
      it('undefined offer text', () => {
        const futureDate = moment().add(10, 'days')
        const date = new LocalDate(futureDate.year(), futureDate.month(), futureDate.day())
        const errors = validator.validateSync(new Offer(undefined, date))
        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.OFFER_REQUIRED)
        expectValidationError(errors, ValidationErrors.OFFER_TEXT_TOO_LONG.replace('$constraint1','99000'))
      })

      it('undefined offer date', () => {
        const errors = validator.validateSync(new Offer('offer text', undefined))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      })

      it('date in past', () => {
        const errors = validator.validateSync(new Offer('offer text', new LocalDate(1980, 10, 11)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.FUTURE_DATE)
      })
    })

    describe('should accept when', () => {
      it('offer text and future date', () => {
        const futureDate = moment().add(10, 'days')
        const date = new LocalDate(futureDate.year(), futureDate.month(), futureDate.day())
        const errors = validator.validateSync(new Offer('offer text', date))
        expect(errors.length).to.equal(1)
      })
    })
  })
})
