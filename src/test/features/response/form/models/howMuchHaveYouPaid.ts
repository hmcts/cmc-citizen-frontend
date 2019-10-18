/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { HowMuchHaveYouPaid, ValidationErrors } from 'response/form/models/howMuchHaveYouPaid'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { LocalDate, ValidationErrors as LocalDateValidationErrors } from 'forms/models/localDate'
import { generateString, expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { Validator } from '@hmcts/class-validator'

const validLocalDate = LocalDate.fromObject({ day: 1, month: 1, year: 2010 })
const validAmount = 100
const validText = 'valid'

describe('HowMuchHaveYouPaid', () => {
  const validator: Validator = new Validator()

  context('should not be valid when', () => {
    context('amount is', () => {
      it('eq 0', () => {
        const errors = validator.validateSync(new HowMuchHaveYouPaid(0, validLocalDate, validText))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })

      it('less than 0', () => {
        const errors = validator.validateSync(new HowMuchHaveYouPaid(-10, validLocalDate, validText))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.AMOUNT_NOT_VALID)
      })
    })

    context('date is', () => {
      it('in the future', () => {
        const dateInThePast = LocalDate.fromObject({ day: 10, month: 10, year: 2200 })
        const errors = validator.validateSync(new HowMuchHaveYouPaid(validAmount, dateInThePast, validText))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.VALID_PAST_DATE)
      })

      it('invalid', () => {
        const dateInThePast = LocalDate.fromObject({ day: 33, month: 13, year: 1990 })
        const errors = validator.validateSync(new HowMuchHaveYouPaid(validAmount, dateInThePast, validText))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, LocalDateValidationErrors.DAY_NOT_VALID)
      })

      it('undefined', () => {
        const errors = validator.validateSync(new HowMuchHaveYouPaid(validAmount, undefined, validText))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, DefaultValidationErrors.DATE_REQUIRED)
      })
    })

    context('text is', () => {
      it('empty', () => {
        const errors = validator.validateSync(new HowMuchHaveYouPaid(validAmount, validLocalDate, ''))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
      })

      it('undefined', () => {
        const errors = validator.validateSync(new HowMuchHaveYouPaid(validAmount, validLocalDate, undefined))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.EXPLANATION_REQUIRED)
      })

      it('too long', () => {
        const errors = validator.validateSync(new HowMuchHaveYouPaid(
          validAmount, validLocalDate, generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
        ))
        expect(errors.length).to.equal(1)
        expectValidationError(errors, DefaultValidationErrors.TEXT_TOO_LONG)
      })
    })
  })
})
