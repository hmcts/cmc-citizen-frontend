import { expect } from 'chai'
import { SelfEmployed, ValidationErrors } from 'response/form/models/statement-of-means/selfEmployed'
import { Validator } from 'class-validator'
import { expectValidationError, generateString } from '../../../../../app/forms/models/validationUtils'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

describe('SelfEmployed', () => {

  describe('deserialize', () => {

    it('should return empty SelfEmployed for undefined given as input', () => {
      const actual = new SelfEmployed().deserialize(undefined)

      expect(actual).to.be.instanceof(SelfEmployed)
      expect(actual.jobTitle).to.be.eq(undefined)
      expect(actual.annualTurnover).to.be.eq(undefined)
      expect(actual.areYouBehindOnTax).to.be.eq(undefined)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })

    it('should return partly populated SelfEmployed', () => {
      const actual = new SelfEmployed().deserialize({
        jobTitle: 'my role', annualTurnover: 10, areYouBehindOnTax: false
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
      expect(actual.areYouBehindOnTax).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })

    it('should return fully populated SelfEmployed', () => {
      const actual = new SelfEmployed().deserialize({
        jobTitle: 'my role', annualTurnover: 10, areYouBehindOnTax: true, amountYouOwe: 2, reason: 'my reason'
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
      expect(actual.areYouBehindOnTax).to.be.eq(true)
      expect(actual.amountYouOwe).to.be.eq(2)
      expect(actual.reason).to.be.eq('my reason')
    })

    it('should not populate amountYouOwe and reason when areYouBehindOnTax = false', () => {
      const actual = new SelfEmployed().deserialize({
        jobTitle: 'my role', annualTurnover: 10, areYouBehindOnTax: false, amountYouOwe: 2, reason: 'my reason'
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
      expect(actual.areYouBehindOnTax).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })
  })

  describe('fromObject', () => {

    it('should return undefined when undefined given', () => {
      const actual = SelfEmployed.fromObject(undefined)

      expect(actual).to.be.eq(undefined)
    })

    it('should return partly populated SelfEmployed', () => {
      const actual = SelfEmployed.fromObject({
        jobTitle: 'my role', annualTurnover: 10, areYouBehindOnTax: false
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
      expect(actual.areYouBehindOnTax).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })

    it('should return fully populated SelfEmployed', () => {
      const actual = SelfEmployed.fromObject({
        jobTitle: 'my role', annualTurnover: 10, areYouBehindOnTax: true, amountYouOwe: 2, reason: 'my reason'
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
      expect(actual.areYouBehindOnTax).to.be.eq(true)
      expect(actual.amountYouOwe).to.be.eq(2)
      expect(actual.reason).to.be.eq('my reason')
    })

    it('should not populate amountYouOwe and reason when areYouBehindOnTax = false', () => {
      const actual = SelfEmployed.fromObject({
        jobTitle: 'my role', annualTurnover: 10, areYouBehindOnTax: false, amountYouOwe: 2, reason: 'my reason'
      })

      expect(actual.jobTitle).to.be.eq('my role')
      expect(actual.annualTurnover).to.be.eq(10)
      expect(actual.areYouBehindOnTax).to.be.eq(false)
      expect(actual.amountYouOwe).to.be.eq(undefined)
      expect(actual.reason).to.be.eq(undefined)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('should accept', () => {

      it('only mandatory field given with valid values', () => {
        const errors = validator.validateSync(new SelfEmployed('My role', 1000, false))

        expect(errors.length).to.equal(0)
      })

      it('all fields given with valid values', () => {
        const errors = validator.validateSync(new SelfEmployed('My role', 1000, false, 100, 'reason'))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject when', () => {

      it('in input', () => {
        const errors = validator.validateSync(new SelfEmployed())

        expect(errors.length).to.equal(3)
        expectValidationError(errors, ValidationErrors.JOB_TITLE_REQUIRED)
        expectValidationError(errors, ValidationErrors.ANNUAL_TURNOVER_REQUIRED)
        expectValidationError(errors, GlobalValidationErrors.YES_NO_REQUIRED)
      })

      it('too long role name', () => {
        const errors = validator.validateSync(
          new SelfEmployed(
            generateString(GlobalValidationConstants.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 1000, false
          )
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.TOO_LONG_INPUT)
      })

      it('too many decimal digits for annualTurnover', () => {
        const errors = validator.validateSync(new SelfEmployed('my role', 10.111, false))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
      })

      it('too much annualTurnover', () => {
        const errors = validator.validateSync(
          new SelfEmployed('my role', GlobalValidationConstants.MAX_VALUE + 1, false)
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.TOO_MUCH)
      })

      context('should reject on validation of optional fields when', () => {

        it('amountYouOwe and reason are empty', () => {
          const errors = validator.validateSync(
            new SelfEmployed('my role', 100, true, undefined, undefined)
          )

          expect(errors.length).to.equal(2)
          expectValidationError(errors, GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
          expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
        })

        it('amountYouOwe < 1', () => {
          const errors = validator.validateSync(
            new SelfEmployed('my role', 100, true, 0.99, 'my reason')
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED)
        })

        it('too many decimal digits for amountYouOwe', () => {
          const errors = validator.validateSync(
            new SelfEmployed('my role', 111, true, 2.1111, 'my reason')
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
        })

        it('too much amountYouOwe', () => {
          const errors = validator.validateSync(
            new SelfEmployed('my role', 111, true, GlobalValidationConstants.MAX_VALUE + 1, 'my reason')
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.TOO_MUCH)
        })

        it('too long reason', () => {
          const errors = validator.validateSync(
            new SelfEmployed('my role', 111, true, 10, generateString(GlobalValidationConstants.FREE_TEXT_MAX_LENGTH + 1))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.TOO_LONG_INPUT)
        })
      })
    })
  })
})
