/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from 'class-validator'
import { expectNumberOfValidationErrors, expectValidationError } from 'test/app/forms/models/validationUtils'
import { HowMuchPaid, ValidationErrors } from 'response/form/models/howMuchPaid'
import { LocalDate, ValidationErrors as LocalDateValidationErrors } from 'forms/models/localDate'
import * as moment from 'moment'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

describe('HowMuchPaid', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const howMuchPaid = new HowMuchPaid()
      expect(howMuchPaid.text).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new HowMuchPaid().deserialize(undefined)).to.eql(new HowMuchPaid())
    })

    it('should return an instance from given object', () => {
      const description: string = 'I do not owe this money'
      const amount: number = 300
      const result: HowMuchPaid = new HowMuchPaid().deserialize({
        amount: amount,
        text: description
      })
      expect(result.amount).to.be.equals(amount)
      expect(result.text).to.be.equals(description)
    })
  })

  describe('isCompleted', () => {
    let howMuchPaid: HowMuchPaid

    beforeEach(() => {
      howMuchPaid = new HowMuchPaid()
    })

    it('should return false when text is undefined', () => {
      howMuchPaid.amount = 300
      howMuchPaid.date = new LocalDate(27, 1, 12)
      howMuchPaid.text = undefined
      expect(howMuchPaid.isCompleted()).to.equal(false)
    })

    it('should return false when date is wrong format', () => {
      howMuchPaid.amount = 300
      howMuchPaid.date = new LocalDate(0, 1, 1)
      howMuchPaid.text = 'text'
      expect(howMuchPaid.isCompleted()).to.equal(false)
    })

    it('should return false when amount is undefined', () => {
      howMuchPaid.amount = undefined
      howMuchPaid.date = new LocalDate(2019, 1, 1)
      howMuchPaid.text = 'text'
      expect(howMuchPaid.isCompleted()).to.equal(false)
    })

    it('should return true when amount, text and date is defined', () => {
      howMuchPaid.amount = 300
      howMuchPaid.date = new LocalDate(2017, 1, 12)
      howMuchPaid.text = 'text'
      expect(howMuchPaid.isCompleted()).to.equal(true)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()
    const aDayBeforeNow = moment().subtract(1, 'days')
    const pastDate = new LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date())

    it('should reject how much to pay text with undefined', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, pastDate, undefined))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with null type', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, pastDate))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with empty string', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, pastDate, ''))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with white spaces string', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, pastDate, '    '))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject when amount not specified', () => {
      const errors = validator.validateSync(new HowMuchPaid(undefined, pastDate, 'i don’t owe the amount of £300'))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject when amount with two decimal places in amount', () => {
      const errors = validator.validateSync(new HowMuchPaid(10.123, pastDate, 'i don’t owe the amount of £300'))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('should reject how much to pay text with more than max allowed characters', () => {
      const text = randomstring.generate({
        length: ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1,
        charset: 'alphabetic'
      })

      const errors = validator.validateSync(new HowMuchPaid(300, pastDate, text))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    it('should accept how much to pay text with max allowed characters', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, pastDate), randomstring.generate(ValidationConstraints.FREE_TEXT_MAX_LENGTH))

      expectNumberOfValidationErrors(errors, 1)
      expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
    })

    context('when pay by set date is known', () => {
      it('should pass with past date, amount and text', () => {
        const errors = validator.validateSync(new HowMuchPaid(300, pastDate, 'i don’t owe the amount of £300'))

        expectNumberOfValidationErrors(errors, 0)
      })

      it('should reject date not defined', () => {
        const errors = validator.validateSync(new HowMuchPaid(300, undefined, 'i don’t owe the amount of £300'))

        expectNumberOfValidationErrors(errors, 1)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(20, 2, 29), 'i don’t owe the amount of £300'))

        expectNumberOfValidationErrors(errors, 1)
        expectValidationError(errors, LocalDateValidationErrors.YEAR_FORMAT_NOT_VALID)
      })
    })
  })
})
