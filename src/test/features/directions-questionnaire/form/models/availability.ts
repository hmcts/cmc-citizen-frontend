/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { Availability, ValidationErrors } from 'directions-questionnaire/forms/models/availability'
import { daysFromNow } from 'test/localDateUtils'

describe('Availability', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const availability: Availability = new Availability()
      expect(availability.hasUnavailableDates).to.be.undefined
      expect(availability.unavailableDates).to.be.undefined
      expect(availability.newDate).to.be.undefined
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject when null', () => {
      const errors = validator.validateSync(new Availability(null, null, null))

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject availability without confirmation', () => {
      const errors = validator.validateSync(new Availability())

      expect(errors).to.not.be.empty
      expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
    })

    it('should reject availability with affirmation of unavailable dates but no dates given', () => {
      const errors = validator.validateSync(new Availability(true))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.AT_LEAST_ONE_DATE)
    })

    it('should reject availability with a past date', () => {
      const errors = validator.validateSync(new Availability(true, [daysFromNow(1)], daysFromNow(-1)))

      expect(errors).to.not.be.empty
      expectValidationError(errors, ValidationErrors.FUTURE_DATE_REQUIRED)
    })

    it('should accept availability with affirmation of unavailable dates and dates given', () => {
      const errors = validator.validateSync(new Availability(true, [daysFromNow(1)]))
      expect(errors).to.be.empty
    })

    it('should accept availability with denial of unavailable dates', () => {
      const errors = validator.validateSync(new Availability(false))
      expect(errors).to.be.empty
    })
  })

  describe('isCompleted', () => {
    it('Should be marked not completed when no confirmation', () => {
      const availability: Availability = new Availability(undefined)
      expect(availability.isCompleted()).to.be.false
    })

    it('Should be marked complete when denied having unavailable dates', () => {
      const availability: Availability = new Availability(false)
      expect(availability.isCompleted()).to.be.true
    })

    it('Should be marked not complete when affirmed having unavailable dates but no dates given', () => {
      const availability: Availability = new Availability(true)
      expect(availability.isCompleted()).to.be.false
    })

    it('Should be marked complete when affirmed having unavailable dates and dates given', () => {
      const availability: Availability = new Availability(true, [daysFromNow(2)])
      expect(availability.isCompleted()).to.be.true
    })
  })
})
