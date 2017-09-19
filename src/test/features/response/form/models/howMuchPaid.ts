/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../app/forms/models/validationUtils'
import { HowMuchPaid, ValidationErrors } from 'response/form/models/howMuchPaid'
import { LocalDate } from 'forms/models/localDate'

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

    it('should return an instance initialised with defaults for null', () => {
      expect(new HowMuchPaid().deserialize(null)).to.eql(new HowMuchPaid())
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

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject how much to pay text with undefined', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), undefined))
      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with null type', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), null))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with empty string', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), ''))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with white spaces string', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), '    '))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED)
    })

    it('should reject when amount not specified', () => {
      const errors = validator.validateSync(new HowMuchPaid(undefined, new LocalDate(2017, 2, 29), 'i don’t owe the amount of £300'))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject how much to pay text with more than 99000 characters', () => {
      const text = randomstring.generate({
        length: 99001,
        charset: 'alphabetic'
      })
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), text))
      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.REASON_NOT_OWE_MONEY_TOO_LONG.replace('$constraint1', '99000'))
    })

    it('should accept how much to pay text with 99000 characters', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), randomstring.generate(9900)))
      expect(errors.length).to.equal(1)
    })

    it('should accept valid how much to pay text', () => {
      const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), 'i don’t owe the amount of £300'))
      expect(errors.length).to.equal(1)
    })

    context('when pay by set date is known', () => {
      it('should reject non existing date', () => {
        const errors = validator.validateSync(new HowMuchPaid(300, new LocalDate(2017, 2, 29), 'i don’t owe the amount of £300'))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.VALID_PAST_DATE)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(new HowMuchPaid(300, null, 'i don’t owe the amount of £300'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      })
    })
  })
})
