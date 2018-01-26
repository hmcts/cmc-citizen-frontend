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
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const whenDidYouPay = new WhenDidYouPay()
      expect(whenDidYouPay.text).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new WhenDidYouPay().deserialize(undefined)).to.eql(new WhenDidYouPay())
    })

    it('should return an instance from given object', () => {
      const description: string = 'Paid by cheque'
      const result: WhenDidYouPay = new WhenDidYouPay().deserialize({
        text: description
      })
      expect(result.text).to.be.equals(description)
    })
  })

  describe('isCompleted', () => {
    let whenDidYouPay: WhenDidYouPay

    beforeEach(() => {
      whenDidYouPay = new WhenDidYouPay()
    })

    it('should return false when text is undefined', () => {
      whenDidYouPay.date = new LocalDate(27, 1, 12)
      whenDidYouPay.text = undefined
      expect(whenDidYouPay.isCompleted()).to.equal(false)
    })

    it('should return false when date is wrong format', () => {
      whenDidYouPay.date = new LocalDate(0, 1, 1)
      whenDidYouPay.text = 'text'
      expect(whenDidYouPay.isCompleted()).to.equal(false)
    })

    it('should return true when text and date is defined', () => {
      whenDidYouPay.date = new LocalDate(2017, 1, 12)
      whenDidYouPay.text = 'text'
      expect(whenDidYouPay.isCompleted()).to.equal(true)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject how much to pay text with undefined', () => {
      const now = moment()
      const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, undefined))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.HOW_DID_YOU_PAY_AMOUNT_CLAIMED)
    })

    it('should reject how much to pay text with null type', () => {
      const now = moment()
      const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
      const errors = validator.validateSync(new WhenDidYouPay(pastDate))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.HOW_DID_YOU_PAY_AMOUNT_CLAIMED)
    })

    it('should reject how much to pay text with empty string', () => {
      const now = moment()
      const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, ''))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.HOW_DID_YOU_PAY_AMOUNT_CLAIMED)
    })

    it('should reject how much to pay text with white spaces string', () => {
      const now = moment()
      const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, '    '))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.HOW_DID_YOU_PAY_AMOUNT_CLAIMED)
    })

    it('should reject how much to pay text with more than max allowed characters', () => {
      const text = randomstring.generate({
        length: ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1,
        charset: 'alphabetic'
      })
      const now = moment()
      const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
      const errors = validator.validateSync(new WhenDidYouPay(pastDate, text))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept how much to pay text with max allowed characters', () => {
      const now = moment()
      const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
      const errors = validator.validateSync(new WhenDidYouPay(pastDate), randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    context('when pay by set date is known', () => {
      it('should pass with past date and text', () => {
        const now = moment()
        const pastDate = new LocalDate(now.year(), now.month() + 1, now.day() - 1)
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
