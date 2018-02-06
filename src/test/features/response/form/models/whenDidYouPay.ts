/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from 'class-validator'
import { expectNumberOfValidationErrors, expectValidationError } from '../../../../app/forms/models/validationUtils'
import { WhenDidYouPay, ValidationErrors } from 'response/form/models/whenDidYouPay'
import { LocalDate } from 'forms/models/localDate'
import * as moment from 'moment'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

describe('WhenDidYouPay', () => {

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new WhenDidYouPay().deserialize(undefined)).to.deep.equal(new WhenDidYouPay())
    })

    it('should return an instance from given object', () => {
      const description: string = 'Paid by cheque'
      const result: WhenDidYouPay = new WhenDidYouPay().deserialize({
        text: description
      })
      expect(result.text).to.be.equals(description)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject how much to pay text with undefined', () => {
      const aDayBeforeNow = moment().subtract(1, 'days')
      const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, undefined))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject how much to pay text with null type', () => {
      const aDayBeforeNow = moment().subtract(1, 'days')
      const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
      const errors = validator.validateSync(new WhenDidYouPay(pastDate))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject how much to pay text with empty string', () => {
      const aDayBeforeNow = moment().subtract(1, 'days')
      const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, ''))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject how much to pay text with white spaces string', () => {
      const aDayBeforeNow = moment().subtract(1, 'days')
      const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, '    '))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
    })

    it('should reject how much to pay text with more than max allowed characters', () => {
      const text = randomstring.generate({
        length: ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1,
        charset: 'alphabetic'
      })
      const aDayBeforeNow = moment().subtract(1, 'days')
      const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, text))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept how much to pay text with max allowed characters', () => {
      const aDayBeforeNow = moment().subtract(1, 'days')
      const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
      const errors = validator.validateSync(new WhenDidYouPay(pastDate), randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    context('when pay by set date is known', () => {
      it('should pass with past date and text', () => {
        const aDayBeforeNow = moment().subtract(1, 'days')
        const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())
        const errors = validator.validateSync(new WhenDidYouPay(pastDate, 'Paid by cheque'))

        expectNumberOfValidationErrors(errors, 0)
      })

      it('should reject date not defined', () => {
        const errors = validator.validateSync(new WhenDidYouPay(undefined, 'Paid by cheque'))

        expectNumberOfValidationErrors(errors, 1)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(new WhenDidYouPay(new LocalDate(20, 2, 29), 'Paid by cheque'))

        expectNumberOfValidationErrors(errors, 1)
        expectValidationError(errors, ValidationErrors.DATE_INVALID_YEAR)
      })
    })
  })
})
